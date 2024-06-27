class CounsellingForm {
    constructor(studentName, grade, schoolName, parentName, parentOccupation, mobileNumber, zipcode, city, session, date,createdDate=new Date()) {
      this.studentName = String(studentName);
      this.grade = String(grade);
      this.schoolName = String(schoolName);
      this.parentName = String(parentName);
      this.parentOccupation = String(parentOccupation);
      this.mobileNumber = String(mobileNumber);
      this.zipcode = Number(zipcode);
      this.city = String(city);
      this.session = String(session);
      this.date = new Date(date);
      this.createdDate = new Date(createdDate);
    }
  }
  module.exports = CounsellingForm;