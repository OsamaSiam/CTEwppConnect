"use strict";
// Supports ES6
exports.__esModule = true;
// import { create, Whatsapp } from '@wppconnect-team/wppconnect';
var wppconnect = require('@wppconnect-team/wppconnect');
var Database = require('./sql/contactsQuery.js');
var analyzeText = require('./resources/textAnalysis.js');
var writeMessage = require('./resources/messageBuilder.js');
wppconnect
    .create({
    session: 'CTEsession',
    puppeteerOptions: {
        userDataDir: './tokens/CTEsession'
    }
})
    .then(function (client) { return start(client); })["catch"](function (error) { return console.log(error); });
function start(client) {
    client.onMessage(function (message) {
        var senderNumber = message.from;
        senderNumber = senderNumber.substring(0, 12);
        console.log('Phone Number is ' + senderNumber);
        var config = {
            host: 'localhost',
            user: 'Osama',
            password: '123456',
            database: 'contacts'
        };
        var str_sql = 'SELECT * FROM users WHERE phone_number = ' + senderNumber;
        var mydb = new Database(config);
        var basicUserInfo, additionalUserInfo, serviceRequested;
        var userAcademicRecords, userCourseSubjects;
        var staffRecords;
        var staffList = [];
        mydb.query(str_sql)
            .then(function (rows) {
            basicUserInfo = rows[0];
        })
            .then(function () {
            if (basicUserInfo.user_type === 'trainee') {
                basicUserInfo.user_type = basicUserInfo.user_type + 's'; //this (if) is only for this version becuase trainee stored in DB as "trinee"
            }
            config.database = basicUserInfo.user_type;
            str_sql = str_sql.replace('users', 'id');
            var mydb = new Database(config);
            return mydb.query(str_sql);
        })
            .then(function (rows) {
            additionalUserInfo = rows[0];
            if (basicUserInfo.user_type === 'trainees') {
                str_sql = str_sql.replace('id', 'academic');
                str_sql = str_sql.replace('phone_number', 'academic_ID');
                str_sql = str_sql.replace(senderNumber, basicUserInfo.college_ID);
                config.database = basicUserInfo.user_type;
                var mydb_1 = new Database(config);
                return mydb_1.query(str_sql);
            }
            else if (basicUserInfo.user_type === 'staff') {
                // maybe skip to text analayzer?
                return;
            }
        })
            .then(function (rows) {
            if (rows) {
                userAcademicRecords = rows[0];
                userCourseSubjects = Object.keys(userAcademicRecords);
                config.database = 'staff';
                var mydb_2 = new Database(config);
                var staffList_str_sql = 'SELECT `ENfirst_name`, `ENlast_name`, `department`, `email`, `office_no`, `office_hours`, `ext` FROM `contact_info`';
                return mydb_2.query(staffList_str_sql);
            }
            else {
                return;
            }
        })
            .then(function (rows) {
            if (rows !== undefined) {
                staffRecords = rows;
                for (var i = 0; i < staffRecords.length; i++) {
                    staffList.push(staffRecords[i].ENfirst_name + ' ' + staffRecords[i].ENlast_name);
                }
            }
            serviceRequested = analyzeText(message.body, senderNumber, basicUserInfo.user_type, userCourseSubjects, staffList);
            if (typeof serviceRequested === 'object') {
                console.log('testing recording: ', serviceRequested);
                config.database = 'requests';
                var mydb_3 = new Database(config);
                var record_sql = void 0;
                // check if there any current exact pending requests by sedning  conditional query and used that query result in reply
                if (serviceRequested.itemRequested > 0) {
                    console.log('hello1 : ', serviceRequested);
                    if (serviceRequested.serviceRequested === 'reject') {
                        record_sql =
                            'UPDATE record SET status = rejected WHERE request_id = ' +
                                serviceRequested.itemRequested;
                    }
                    else if (serviceRequested.serviceRequested == 'approve' && additionalUserInfo.role === 'advisor') {
                        record_sql =
                            'UPDATE record SET status = approved, staff_pending = timetabler WHERE request_id = ' +
                                serviceRequested.itemRequested;
                    }
                    else if (serviceRequested.serviceRequested == 'approve' && additionalUserInfo.role === 'timetabler') {
                        record_sql =
                            'UPDATE record SET status = completed, staff_pending = NULL WHERE request_id = ' +
                                serviceRequested.itemRequested;
                    }
                    else if (serviceRequested.serviceRequested == 'requestInfo') {
                        if (basicUserInfo.user_type === 'trainees') {
                            record_sql =
                                'SELECT * FROM record WHERE trainee_ID = ' +
                                    basicUserInfo.college_ID +
                                    ' AND request_id = ' +
                                    serviceRequested.itemRequested;
                        }
                        else if (basicUserInfo.user_type === 'staff') {
                            record_sql =
                                'SELECT * FROM record WHERE group_ID = ' +
                                    additionalUserInfo.manage_group_ID +
                                    ' AND request_id = ' +
                                    serviceRequested.itemRequested;
                        }
                    }
                }
                else if (serviceRequested === 'list') {
                    if (basicUserInfo.user_type === 'trainees') {
                        record_sql =
                            'SELECT * FROM record WHERE status = Pending AND trainee_ID = ' +
                                basicUserInfo.college_ID;
                    }
                    else if (basicUserInfo.user_type === 'staff') {
                        record_sql =
                            'SELECT * FROM record WHERE status = Pending AND group_ID = ' +
                                additionalUserInfo.manage_group_ID;
                    }
                }
                else if (['add', 'remove'].includes(serviceRequested.serviceRequested)) {
                    record_sql =
                        "INSERT INTO record ( request_type, item_requested, trainee_ID, trainee_name, group_ID, request_timestamp, reason) VALUES ('" +
                            serviceRequested.serviceRequested + "', '" +
                            serviceRequested.itemRequested + "', '" +
                            additionalUserInfo.academic_ID + "', '" +
                            additionalUserInfo.ENfirst_name + ' ' + additionalUserInfo.ENlast_name + "', '" +
                            additionalUserInfo.group_ID + "', " +
                            'NOW(), ' +
                            "'reasons')"; // variable reasons of request from trainee should inserted
                }
                console.log('testing recoer sql: ', record_sql);
                return mydb_3.query(record_sql);
            }
        })
            .then(function (rows) {
            if (rows !== undefined && ['add', 'remove'].includes(serviceRequested.serviceRequested)) {
                console.log(rows.affectedRows + ' record(s) updated');
                serviceRequested.recorded = true;
                serviceRequested.requestID = rows.insertId;
            }
            return writeMessage(serviceRequested, basicUserInfo, additionalUserInfo, userAcademicRecords, userCourseSubjects);
        })
            .then(function (messageText) {
            var messageToBeSent = null;
            messageToBeSent = messageText;
            if (messageToBeSent !== null) {
                client
                    .sendText(message.from, messageToBeSent)
                    .then(function (result) {
                    console.log(message.from, ' Result sent'); //return object success
                })["catch"](function (erro) {
                    console.error('Error when sending: ', erro); //return object error
                });
            }
            if (!basicUserInfo.intro) {
                var str_sql_1 = 'UPDATE users SET intro = true WHERE phone_number = ' +
                    basicUserInfo.phone_number;
                config.database = 'contacts';
                var mydb_4 = new Database(config);
                mydb_4
                    .query(str_sql_1)
                    .then(function (rows) {
                    console.log(rows.affectedRows + ' record(s) updated');
                })["catch"](function (err) {
                    console.log('Error when updating first time usage: ', err.message);
                });
            }
        })
            .then(function () {
            return mydb.close();
        }, function (err) {
            return mydb.close().then(function () {
                throw err;
            });
        })["catch"](function (err) {
            // handle the error
            console.log(err.message);
        });
    });
}
