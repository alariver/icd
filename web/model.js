/**
 * Created with JetBrains WebStorm.
 * User: changzhenghe
 * Date: 9/25/13
 * Time: 9:56 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 User Class
 **/
function User(userID,userName,passwd,createDate,expireDate,status,adminUser,email,mobile,grantedTgts) {
    this.userID = userID;
    this.userName = userName;
    this.passwd = passwd;
    this.createDate = createDate;
    this.expireDate = expireDate;
    this.status = status;
    this.adminUser = adminUser;
    this.email = email;
    this.mobile = mobile;
    this.grantedTgts = grantedTgts;
}

User.prototype = {
    toString: function() {
        return "userid:"+userID+"\n userName:"+userName+"\n passwd:"+passwd+"\n createDate:"+createDate+"\n expireDate:"+expireDate+
            "\n status:"+status+"\n adminUser:"+adminUser+"\n email:"+email+"\n mobile:"+mobile;
    }
} ;

/*
    Monitor Target Class
 */
function MonitorTarget(tgtID, tgtName, tgtLicense, tgtStatus, typeDef, custInfo, connCfg, cfgID, custID, tgtType, tgtosID, monitoringStatus) {
    this.tgtID = tgtID;
    this.tgtName = tgtName;
    this.tgtLicense = tgtLicense;
    this.tgtStatus = tgtStatus;
    this.typeDef = typeDef;
    this.custInfo = custInfo;
    this.connCfg = connCfg;
    this.cfgID = cfgID;
    this.custID = custID;
    this.tgtType = tgtType;
    this.tgtosID = tgtosID;
    this.monitoringStatus = monitoringStatus;
}

MonitorTarget.prototype = {
    toString: function() {
        return tgtName;
    }
};
