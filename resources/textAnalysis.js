var greetingsKeywords = [
  'greeting',
  'hello',
  'hi',
  'hey',
  'good',
  'morning',
  'afternoon',
  'evening',
  'مرحبا',
  'هلا',
  'سلام',
  'السلام',
];
var addingkeywords = [
  'add',
  'adding',
  'addition',
  'اضف',
  'أضف',
  'ضيف',
  'اضافة',
  'إضافة',
  'اضيف',
  'ضف',
];
var removeKeywords = [
  'remove',
  'removing',
  'removal',
  'drop',
  'احذف',
  'حذف',
  'إزالة',
];
var contactKeywords = [
  'contact',
  'contacts',
  'email',
  'speak',
  'talk',
  'someone',
  'staff',
  'trainter',
  'issue',
  'problem',
  'room',
  'office',
  'inquiry',
  'inquire',
  'query',
  'ايميل',
  'مكتب',
  'غرفة',
  'اتواصل',
  'اتصال',
  'تواصل',
  'اتواصل',
  'اوصل',
  'استفسر',
  'استفسار',
  'المهندس',
  'موظف',
  'المدرب',
  'شخص',
  'ساعات',
  'مكتبية',
];
var letterRequestKeywords = [
  'letter',
  'print',
  'خطاب',
  'تعريف',
  'إفادة',
  'افادة',
];
var listKeywords = ['list'];
var wordLists = [
  greetingsKeywords,
  addingkeywords,
  removeKeywords,
  contactKeywords,
  letterRequestKeywords,
  listKeywords,
];

function textAnalysis(text, senderNumber, userType, subjects, staffList) {
  var result = 'unknown';
  let textKeywords;
  textKeywords = text.toLowerCase().trim();
  textKeywords = textKeywords.split(' ');
  if (text.match('#')) {
    let requestNumber = textKeywords.filter(x => {
      return x.startsWith('#');
    });
    requestNumber = requestNumber.toString();
    requestNumber = parseInt(requestNumber.replace(/[^0-9]/g,''));
    if (requestNumber > 0) {
      if (userType === 'staff') {
        if (textKeywords.includes('approve')) {
          result = {
            serviceRequested: 'approve',
            itemRequested: requestNumber,
          };
        } else if (textKeywords.includes('reject')) {
          result = {
            serviceRequested: 'reject',
            itemRequested: requestNumber,
          };
        }
      } else {
        result = {
          serviceRequested: 'requestInfo',
          itemRequested: requestNumber,
        };
      }
    }
  } else {
    for (let groupedKeywords of wordLists) {
      let testingTextArray = textKeywords.filter((x) =>
        groupedKeywords.includes(x)
      );
      if (testingTextArray.length > 0) {
        let text2ndKeywords = textKeywords;
        textKeywords = testingTextArray;
        result = groupedKeywords[0];
        if (result === 'add' || result === 'remove' || result === 'list') {
          let _2ndTestingTextArray = text2ndKeywords.filter(x => {
            if (result === 'list') {
              return ['pending', 'approved', 'completed'].includes(x);
            } else {
            x = x.toUpperCase();
            return subjects.includes(x);
            }
          });
          if (_2ndTestingTextArray.length > 0) {
            if (result !== 'list') {
              result = {
                serviceRequested: result,
                itemRequested: _2ndTestingTextArray[0].toUpperCase(),
                recorded: false,
              };
            } else if (result === 'list') {
              result = {
                serviceRequested: result,
                criteriaRequested: _2ndTestingTextArray[0],
              };
            }
          } if (result === 'list') {
            result = {
              serviceRequested: result,
              criteriaRequested:'pending',
            };
          }
        }
        console.log('You were trying to ' + result.toString() + ' by using these keywords: ' + textKeywords);
        break;
      }
    }
  }
  let fs = require('fs');
  let dt = new Date();
  let timestamp = dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
  fs.appendFile('./logs/textAnalysisLogs.txt', 'On ' + timestamp + ', The conclusion: ' + result + ', From: :' + senderNumber + ' Based on the following keywords: ' + textKeywords.toString() + '\n From this text: ' + text + '\n', function (err) {
      if (err) return console.log(err);
      console.log('Logging: Text Analysis logged.');
    }
  );
  return result;
}

module.exports = textAnalysis;
