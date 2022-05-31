let diction = {
    MATH301: 'Mathematics 1',
    PHYS301: 'Physics',
    ENGL301: 'English Language 1',
    INSA312: 'Basic Network System Administration',
    INSA351: 'Network Technologies 1',
    INSA343: 'Problem Solving Strategies',
    MATH303: 'Discrete Math',
    GNRL401: 'Intro to Management and Leadership',
    INSA371: 'Advanced Network Administration',
    INSA452: 'Network Technologies 2',
    STAT303: 'Statistics and Probability',
    ENGL302: 'English Language 2',
    INSA453: 'Data Center Operation 1',
    INSA482: 'Ethics in IT',
    INET433: 'Information and Network Security',
    GNRL405: 'Engineering Economy',
    INSA443: 'Network Analysis and Design',
    INSA454: 'Data Center Operation 2',
    INSA483: 'Seminar',
    GNRL402: 'Engineering Projects Management',
    INET434: 'Cyber Security',
    INSA484: 'IT infrastructure Best Practices',
    INSA492: 'Graduation Project',
    IPRG335: 'Advanced Web Programming',
    INSA481: 'Selected Topics',
    INSA444: 'Open Source Network Systems',
    IPRG473: 'Multimedia System Development',
    INET351: 'Communication Networks',
    INSA485: 'Internet of Things',
  };
let subjectPrerequiste = {
    MATH303: 'MATH301',
    INSA371: 'INSA312',
    INSA452: 'INSA351',
    ENGL302: 'ENGL301',
    INSA453: 'INSA371',
    INET433: 'INSA312',
    INSA443: 'INSA452',
    INSA454: 'INSA453',
    INSA483: 'INSA371',
    INET434: 'INET433',
    INSA484: ['INSA312', 'INSA351'],
    INSA492: ['INSA371', 'INSA452', 'INSA454', 'INSA483']
  }

function subjectsData() {
    let subjectsData = {diction, subjectPrerequiste};
    return subjectsData;
  }
module.exports = subjectsData;