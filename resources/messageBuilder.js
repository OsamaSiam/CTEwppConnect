let diction = {
  MATH301: 'Mathematics-1',
  PHY301: 'ppphysics',
  ENGL301: 'Enlish Language-1',
  INSA312: 'Basic Networks System Administration',
  INSA351: 'Networ Technologies 1',
  INSA343: 'Problem Sloving Strategies',
  MATH303: 'Discrete Math',
  GNRL401: 'Intro to Management and Leadership',
  INSA371: 'Advanced Network Administration',
  INSA452: 'Network Technologies 2',
  STAT303: 'Statistics and Probability',
  ENGL302: 'English Langauge 2',
  INSA453: 'Data Center Opertion 1',
  INSA482: 'Ethics in IT',
  INET433: 'Inofrmation and Network Security',
  GNRL405: 'Engineering Economy',
  INSA443: 'Network Analysis and Design',
  INSA454: 'Data Center Opertion 2',
  INSA483: 'Seminar',
  GNRL402: 'Engieering Projects Management',
  INET434: 'Cyber Security',
  INSA484: 'IT infrastructure Best Practices',
  INSA492: 'Graduation Project',
  IPRG335: 'Advanced Web Programming',
  INSA481: 'Selected Topics',
  INSA444: 'Oopen Source Netowrk Systems',
  IPRG473: 'Multimedia System Development',
  INET351: 'Communiation Networks',
  INSA485: 'Internet of Things',
};

function messageBuilder(serviceRequested, basicInfo, additionalInfo, academicRecords, subjects) {
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
        messageText =
          'Your request ID: *' +
          serviceRequested.requestID +
          '* has been recorded in our system.\n' +
          'Kindly allow for some time to pass for approval.\n' +
          'You can check on the status of your request by typing (#) followed by the request ID.\n' +
          'Thank you for using our services';
      } else if (serviceRequested.rejection === true) {
        messageText =
          'Apolgies, the subject you have entered is not available to ' +
          serviceRequested.serviceRequested +
          '.\n' +
          'Kindly make sure you have typed in the correct subject code or choose a subject that is *available to ' +
          serviceRequested.serviceRequested +
          '*.\n Kindly send your request again.';
      } else {
        messageText =
          'Apologies, it seems your request was not recorded due to an error.\n' +
          'Kindly send your request again.\n' +
          'Apoliges for any inconvience caused.';
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
          filteredAcademicRecords.push(subjects[i]);
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
        messageText = messageText.concat('*No subject can ', serviceRequested, 'ed.*\n');
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
