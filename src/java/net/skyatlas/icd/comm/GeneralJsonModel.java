/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.skyatlas.icd.comm;

import net.sf.json.JSONObject;

/**
 *
 * @author changzhenghe
 */
public class GeneralJsonModel {
    private         Integer         retCode = 0;        // -1555, Not Login
    private         String          retInfo = "";
    private         Object          data;
    
    

    public Integer getRetCode() {
        return retCode;
    }

    public void setRetCode(Integer retCode) {
        this.retCode = retCode;
    }

    public String getRetInfo() {
        return retInfo;
    }

    public void setRetInfo(String retInfo) {
        this.retInfo = retInfo;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
    
    public  String toJSONStr() {
        return JSONObject.fromObject(this, new JsonComm().getCommJsonConfig(null, null)).toString();
    }
}


