// Supports ES6

// import { defaultSendMessageOptions } from "@wppconnect/wa-js/dist/chat";
import { exit } from "process";

// import { create, Whatsapp } from '@wppconnect-team/wppconnect';
const wppconnect = require('@wppconnect-team/wppconnect');
const Database = require('./sql/contactsQuery.js');
const analyzeText = require('./resources/textAnalysis.js');
const writeMessage = require('./resources/messageBuilder.js');

wppconnect
  .create({
    session: 'CTEsession',
    puppeteerOptions: {
      userDataDir: './tokens/CTEsession',
    },
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));
function start(client) {
  client.onMessage((message) => {
    let senderNumber = message.from;
    senderNumber = senderNumber.substring(0, 12);
    console.log('Phone Number is ' + senderNumber);
    let config = {
      host: 'localhost',
      user: 'wapAccess',
      password: '123456',
      database: 'contacts',
    };
    let str_sql = 'SELECT * FROM users WHERE phone_number = ' + senderNumber;
    let mydb = new Database(config);
    let basicUserInfo, additionalUserInfo, serviceRequested;
    let userAcademicRecords, userCourseSubjects;
    let staffRecords;
    let staffList = [];
    mydb.query(str_sql)
      .then(rows => {
        basicUserInfo = rows[0];
      })
      .then(() => {
        config.database = basicUserInfo.user_type;
        str_sql = str_sql.replace('users', 'id');
        let mydb = new Database(config);
        return mydb.query(str_sql);
      })
      .then(rows => {
        additionalUserInfo = rows[0];
        if (basicUserInfo.user_type === 'trainee') {
          str_sql = str_sql.replace('id', 'academic');
          str_sql = str_sql.replace('phone_number', 'academic_ID');
          str_sql = str_sql.replace(senderNumber, basicUserInfo.college_ID);
          config.database = basicUserInfo.user_type;
          let mydb = new Database(config);
          return mydb.query(str_sql);
        } else if (basicUserInfo.user_type === 'staff') {
          // maybe skip to text analayzer?
          return;
        }
      })
      .then(rows => {
        if (rows) {
          userAcademicRecords = rows[0];
          userCourseSubjects = Object.keys(userAcademicRecords);
          config.database = 'staff';
          let mydb = new Database(config);
          let staffList_str_sql =
            'SELECT `ENfirst_name`, `ENlast_name`, `department`, `email`, `office_no`, `office_hours`, `ext` FROM `contact_info`';
          return mydb.query(staffList_str_sql);
        } else {
          return;
        }
      })
      .then(rows => {
        if (rows !== undefined) {
          staffRecords = rows;
          for ( let i = 0; i < staffRecords.length; i++) {
            staffList.push(staffRecords[i].ENfirst_name + ' ' + staffRecords[i].ENlast_name);
          }
        }
        serviceRequested = analyzeText(message.body, senderNumber, basicUserInfo.user_type, userCourseSubjects, staffList);
        if (typeof serviceRequested === 'object') {
          config.database = 'requests';
          let mydb = new Database(config);
          let record_sql;
          // check if there any current exact pending requests by sedning  conditional query and used that query result in reply
          if (serviceRequested.itemRequested > 0) {
            console.log('hello1 : ', serviceRequested);
            if(serviceRequested.serviceRequested === 'reject'){
              record_sql =
                'UPDATE record SET status = rejected WHERE request_id = ' +
                serviceRequested.itemRequested;
            } else if (serviceRequested.serviceRequested == 'approve' && additionalUserInfo.role === 'advisor') {
              record_sql =
                'UPDATE record SET status = approved, staff_pending = timetabler WHERE request_id = ' +
                serviceRequested.itemRequested;
            } else if (serviceRequested.serviceRequested == 'approve' && additionalUserInfo.role === 'timetabler') {
              record_sql =
                'UPDATE record SET status = completed, staff_pending = NULL WHERE request_id = ' +
                serviceRequested.itemRequested;
            } else if (serviceRequested.serviceRequested == 'requestInfo') {
              if (basicUserInfo.user_type === 'trainee') {
                record_sql =
                  'SELECT * FROM record WHERE trainee_ID = ' +
                  basicUserInfo.college_ID +
                  ' AND request_id = ' +
                  serviceRequested.itemRequested;
              } else if (basicUserInfo.user_type === 'staff') {
                record_sql =
                  'SELECT * FROM record WHERE group_ID = ' +
                  additionalUserInfo.manage_group_ID +
                  ' AND request_id = ' +
                  serviceRequested.itemRequested;
              }
            }
          } else if(serviceRequested === 'list') {
            if (basicUserInfo.user_type === 'trainee') {
              record_sql =
                'SELECT * FROM record WHERE status = Pending AND trainee_ID = ' +
                basicUserInfo.college_ID;
            } else if (basicUserInfo.user_type === 'staff') {
              record_sql =
                'SELECT * FROM record WHERE status = Pending AND group_ID = ' +
                additionalUserInfo.manage_group_ID;
            }
          } else if (['add', 'remove'].includes(serviceRequested.serviceRequested)) {
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
          return mydb.query(record_sql);
        }
      })
      .then(rows => {
        if (rows !== undefined && ['add', 'remove'].includes(serviceRequested.serviceRequested)) {
          console.log(rows.affectedRows + ' record(s) updated');
          serviceRequested.recorded = true;
          serviceRequested.requestID = rows.insertId;
        }
        return writeMessage(serviceRequested, basicUserInfo, additionalUserInfo, userAcademicRecords, userCourseSubjects);
      })
      .then(messageText => {
        let messageToBeSent = null;
        messageToBeSent = messageText;
        if (messageToBeSent !== null) {
          client
            .sendText(message.from, messageToBeSent)
            .then((result) => {
              console.log(message.from, ' Result sent'); //return object success
            })
            .catch((erro) => {
              console.error('Error when sending: ', erro); //return object error
            });
        }
        if (!basicUserInfo.intro) {
          let str_sql =
            'UPDATE users SET intro = true WHERE phone_number = ' +
            basicUserInfo.phone_number;
          config.database = 'contacts';
          let mydb = new Database(config);
          mydb
            .query(str_sql)
            .then(rows => {
              console.log(rows.affectedRows + ' record(s) updated');
            })
            .catch(err => {
              console.log(
                'Error when updating first time usage: ',
                err.message
              );
            });
        }
      })
      .then(
        () => {
          return mydb.close();
        },
        err => {
          return mydb.close().then(() => {
            throw err;
          });
        }
      )
      .catch(err => {
        // handle the error
        console.log(err.message);
      });
  });
}
