module.exports = {
  getHourAndMinute: () => {
    let date = new Date()
    let hour = String(date.getHours())
    let minute = String(date.getMinutes())
    if (hour.length < 2) {
      hour = '0' + hour
    }
    if (minute.length < 2) {
      minute = '0' + minute
    }
    return hour + ':' + minute
  }  
}