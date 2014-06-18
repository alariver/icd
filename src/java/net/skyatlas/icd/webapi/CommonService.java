/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.webapi;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.skyatlas.icd.comm.GeneralJsonModel;
import net.skyatlas.icd.comm.ReturnInfo;
import net.skyatlas.icd.domain.UserInfo;
import net.skyatlas.icd.util.MemoryGrid;
import oracle.jdbc.pool.OracleDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author changzhenghe
 */
@Controller
@RequestMapping(value = "/api")
public class CommonService {
    @Autowired()
    private net.skyatlas.icd.dao.daoImpl.UserDaoImpl  userDao;
    
    @RequestMapping(value = "/comm/login", method = RequestMethod.GET)
    @ResponseBody
    public  GeneralJsonModel    loginSvc(@RequestParam("userName")String userName, @RequestParam("password")String password) {
        GeneralJsonModel gjm = new GeneralJsonModel();
        UserInfo u;
        u = userDao.getUserByNameAndPwd(userName, password);
        if (u != null) {
            gjm.setRetCode(0);
            gjm.setRetInfo("登陆成功。");
            gjm.setData(u);
        }
        else {
            gjm.setRetCode(ReturnInfo.NOTLOGIN);
            gjm.setRetInfo("登陆失败!");
            
        }
        return gjm;
    }
    
    @RequestMapping(value="/comm/getDiagFromHis", method=RequestMethod.GET)
    @ResponseBody
    public  GeneralJsonModel    getDiagFromHis(@RequestParam(value="anamID", required=false) String anamID, 
            @RequestParam(value="beginDate", required=false) String beginDate, 
            @RequestParam(value="endDate", required=false) String endDate) {
        GeneralJsonModel gjm = new GeneralJsonModel();
        SimpleDateFormat sdf = new SimpleDateFormat(
        "yyyy-MM-dd");
        try {
            OracleDataSource ods = new OracleDataSource();
            ods.setURL("jdbc:oracle:thin:@//10.6.66.15:1521/QuickHIS");
            ods.setUser("oracle");
            ods.setPassword("quickhis");
            
            Connection conn = ods.getConnection();
            String sql = "select main_icd,diag_name,anam_id from fir_out_diag_tab where rownum < 1000";
            if (anamID!=null && !"".equals(anamID)) {
                anamID = anamID.replace("--", "");
                anamID = anamID.replace("/*", "(*");
                sql += " And anam_id = '"+anamID+"'";
            }
            if (beginDate != null) {
                sql += " And diag_date >= to_date('"+beginDate+"','YYYY-MM-DD')";
            }
            if (endDate != null) {
                sql += " And diag_date <= to_date('"+endDate+"','YYYY-MM-DD')";
            }
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            List<HisDiagInfo> arr = new ArrayList();
            while (rs.next()) {
                String mainIcd = rs.getString(1);
                String diagName = rs.getString(2);
                String anam = rs.getString(3);
                if (diagName==null || "".equals(diagName)) {
                    continue;
                }
                HisDiagInfo jobj = new HisDiagInfo();
                jobj.setAnam(anam);
                jobj.setDiagName(diagName);
                jobj.setIcdCode(mainIcd);
                
                arr.add(jobj);
            }
            
            rs.close();
            stmt.close();
            conn.close();
            gjm.setData(arr);
            gjm.setRetCode(0);
            gjm.setRetInfo("查询成功.");
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        
        return gjm;
    }
}

class HisDiagInfo {
    private String  icdCode;
    private String  diagName;
    private String  anam;

    public String getIcdCode() {
        return icdCode;
    }

    public void setIcdCode(String icdCode) {
        this.icdCode = icdCode;
    }

    

    public String getDiagName() {
        return diagName;
    }

    public void setDiagName(String diagName) {
        this.diagName = diagName;
    }

    public String getAnam() {
        return anam;
    }

    public void setAnam(String anam) {
        this.anam = anam;
    }
    
}
