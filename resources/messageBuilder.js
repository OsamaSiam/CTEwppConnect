const subjectsData = require('./subjectsData.js');
let diction = subjectsData['diction'];
let subjectPrerequiste = subjectsData['subjectPrerequiste'];

function messageBuilder(serviceRequested, basicInfo, additionalInfo, academicRecords, subjects, requestsData) {
  return new Promise(resolve => {
    let messageText;
    if (!basicInfo.intro) {
      messageText =
        'Welcome to College of Telecom and Elctornics Whatsapp trainees service platform.\n'
      if (basicInfo.user_type === 'trainee') {
        messageText = messageText.concat(
          'We offer the following services:\n *Add subjects* \n *Remove subjects* \n *Contact staff* \n *Request letter* \n',
          'To use any of the services, kindly reply with one of the text listed above and if you would like to see the list just say hi to us anytime.\n\n'
        );
      } else if (basicInfo.user_type === 'staff') {
        messageText = messageText.concat(
          "This service can be used recieve trainees' requests and help in resolving these requests \n" +
            'To check if there is any pending requests for you, kindly send: \n *List pending*' +
            'To check and resolve requests, kindly send: \n *#[request number]* e.g #3 or #340 \n' +
            'By default, You are currently unregsitered in our system. To be able to receive request notification automatically, please send: \n *register*\n\n'
        );
      }
      messageText =
        messageText +
        'You are conacting us using this phone number ' +
        basicInfo.phone_number +
        ' which registered to ' +
        additionalInfo.ENfirst_name +
        ' ' +
        additionalInfo.ENlast_name +
        ' on the system' +
        '\nIf this is not you, please conact the administrator via Whatapp at +966541199915 to rectify the issue and register your number.';
      resolve(messageText);
    } else if (typeof serviceRequested === 'object') {
      // this is if the add/remove request is correct and logged
      if (serviceRequested.recorded === true) {
        if (serviceRequested.requestID === 0) {
          messageText =
            'You already have pending request to ' +
            serviceRequested.serviceRequested +
            ' the requested subject, *' +
            serviceRequested.itemRequested +
            ': ' +
            diction[serviceRequested.itemRequested] +
            '*.\n Kindly send *List* to check pending requests.';
        } else {
          messageText =
            'Your request ID: *' +
            serviceRequested.requestID +
            '* has been recorded in our system.\n' +
            'Kindly allow for some time to pass for approval.\n' +
            'You can check on the status of your request by typing (#) followed by the request ID.\n' +
            'Thank you for using our services';
        }
      } else if (serviceRequested.rejection === true) {
        messageText =
          'The subject, *' +
          serviceRequested.itemRequested +
          ': ' +
          diction[serviceRequested.itemRequested] +
          '*, you have entered is not available to ' +
          serviceRequested.serviceRequested +
          ' becuase *' +
          serviceRequested.rejectReason +
          '*.\nKindly make sure you have typed in the correct subject code or choose a subject that is *available to ' +
          serviceRequested.serviceRequested +
          '*.\nKindly send your request again.';
      } else if (serviceRequested.recorded === false) {
        messageText =
          'Apologies, it seems your request was not recorded due to an error.\n' +
          'Kindly send your request again.\n' +
          'Apoliges for any inconvience caused.';
      } else if (serviceRequested.serviceRequested === 'requestInfo') {
        console.log('testing here msgBld L116 request info:', serviceRequested);
        if (requestsData !== undefined) {
          messageText =
          'Your request *#' +
          serviceRequested.itemRequested +
          '* to *' +
          requestsData.request_type +
          ' ' +
          requestsData.item_requested +
          ': ' +
          diction[requestsData.item_requested] +
          '* \n Its status is: *' +
          requestsData.status +
          '* \n';
          if (requestsData.status === 'pending'){
            messageText = messageText.concat('it is still pending approval from the *Academic Advisor*')
          } else if (requestsData.status === 'Approved') {
            messageText = messageText.concat('it was approved on *', requestsData.updated_timestamp, '* \nNow, changes requested are pending implementation by the Timetabler.')
          } else if (requestsData.status === 'Completed') {
            messageText = messageText.concat('it was completed on ', requestsData.updated_timestamp)
          }
        } else {
          messageText =
          'The request *#' +
          serviceRequested.itemRequested +
          '* either does not exist or is not registered under your ID\n Please make sure you are entering the correct (#) request number, or type in *List Pending* to see all your pending requests.';
        }
        if (basicInfo.user_type === 'staff') {
          // additional data like student info
          // add buttons to approve or deny message
        }
      } else if (serviceRequested.serviceRequested === 'list') {
        console.log('testing here msgBld L202 list pending', serviceRequested);
        messageText =
          'Your current pending requests for approval are below: \n' + requestsData;
      }
      resolve(messageText);
    } else if (['add', 'remove'].includes(serviceRequested)) {
      messageText =
        'Through this service platform, we will record your request to add/remove subjects and your requests will be sent for approval from the relevant parties.\n' +
        'Once approved and the requested changes are implemented, you will receive a notification via the platform and your timetable should reflect the changes.\n';
      let academicFilterChar;
      let filteredAcademicRecords = [];
      if (serviceRequested === 'add') {
        // filter query result to subjects not finished
        academicFilterChar = 'N';
      } else {
        // filter query result to subjects currently studying
        academicFilterChar = 'C';
      }
      for (let i = 1; i < subjects.length; i++) {
        if (academicRecords[subjects[i]] === academicFilterChar) {
          if (academicFilterChar === 'N') {
            if (typeof subjectPrerequiste[subjects[i]] === 'object') {
              let subjectsPassed = 0;
              let specificSubjectReq = subjectPrerequiste[subjects[i]];
              for ( let i = 0; Object.values(specificSubjectReq).length > i; i++) {
                if (academicRecords[specificSubjectReq[i]] === 'P') {
                  subjectsPassed++;
                }
              }
              if (Object.values(specificSubjectReq).length === subjectsPassed) {
                filteredAcademicRecords.push(subjects[i]);
              }
            } else if (subjectPrerequiste[subjects[i]] === 'string' && academicRecords[subjectPrerequiste[subjects[i]]] === 'P') {
              filteredAcademicRecords.push(subjects[i]);
            } else if (academicRecords[subjectPrerequiste[subjects[i]]] === undefined) {
              filteredAcademicRecords.push(subjects[i]);
            }
          } else {
            filteredAcademicRecords.push(subjects[i]);
          }
        }
      }
      // start testing removal of alternate subejcts
      if (!filteredAcademicRecords.includes('IPRG335' && 'INSA481 ')) {
        filteredAcademicRecords = filteredAcademicRecords.filter(x => !['IPRG335', 'INSA481'].includes(x));
      }
      if (!filteredAcademicRecords.includes('INSA444' && 'IPRG473')) {
        filteredAcademicRecords = filteredAcademicRecords.filter(x => !['INSA444', 'IPRG473'].includes(x));
      }
      if (!filteredAcademicRecords.includes('INET351' && 'INSA485')) {
        filteredAcademicRecords = filteredAcademicRecords.filter(x => !['INET351', 'INSA485'].includes(x));
      }
      // end testing removal of alternate subejcts
      // #todo add subjects names to the array after the subjects codes
      if (filteredAcademicRecords.length > 0) {
        messageText = messageText.concat('You have the following subjects you can ', serviceRequested, ':\n');
        for (let i = 0; i < filteredAcademicRecords.length; i++) {
          messageText = messageText.concat(
            '*' + filteredAcademicRecords[i] + '*: '+ diction[filteredAcademicRecords[i]] +'\n'
          );
        }
        messageText = messageText.concat(
          'To request the service reply with ' +
            serviceRequested +
            ' followed by the subjects code.\n For example: ' +
            serviceRequested +
            ' MATH301'
        );
      } else {
        messageText = messageText.concat('*No subject to ', serviceRequested, '.*\n');
      }
      resolve(messageText);
    } else if (serviceRequested === 'contact') {
      messageText = 'get staff contact info message';
      resolve(messageText);
    } else if (serviceRequested === 'letter') {
      messageText =
        'What type of letter would you like to reques?\n' +
        'Please reply with one of the following:\n' +
        '*Letter of Indication*\n' +
        '*Exams Letter*';
      resolve(messageText);
    } else {
      if (serviceRequested === 'greeting') {
        messageText =
          'Hello, ' +
          additionalInfo.ENfirst_name +
          ' ' +
          additionalInfo.ENlast_name +
          '\nThis is the College of Telecom and Elctornics Whatsapp trainees service platform. ';
      } else if (serviceRequested === 'unknown') {
        messageText = 'Sorry, I could not understand what you have typed.\n';
      }
      messageText = messageText.concat(
        'We offer the following services:\n *Add subjects* \n *Remove subjects* \n *Contact staff* \n *Request letter* \n' +
          'To use any of the services, kindly reply with one of the text listed above'
      );
      resolve(messageText);
    }
    return messageText;
  });
}

module.exports = messageBuilder;
