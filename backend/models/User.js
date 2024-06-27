const bcrypt = require('bcryptjs');

class User {
  constructor(username, email, password, createdDate=new Date()) {
    this.username = username;
    this.email = email;
    this.password = password;
    // this.resetPasswordToken = resetPasswordToken;
    // this.resetPasswordExpires = resetPasswordExpires;
    this.createdDate = new Date(createdDate);
  }

  async save() {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // In a real application, you would save the user to the database here
    // For demonstration purposes, we'll just log the user object
    console.log('Saving user:', this);
    // Replace the log statement above with your database saving logic

    return this; // Return the user object
  }
}

module.exports = User;
