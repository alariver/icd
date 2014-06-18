/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.skyatlas.icd.comm;


import java.text.SimpleDateFormat;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;
/**
 * [Java -> JSON] java.util.Date -> "yyyy-MM-dd" etc. string <br/>
 * 
 * Json-lib默认的Java -> JSON的日期表示格式与java经常用的大相径庭，所以使用此
 * 扩展来将Date格式化为字符串。
 * 
 * 
 * @author btpka3
 */
public class DateJsonValueProcessor implements JsonValueProcessor {
    private String dateFormat = "yyyy-MM-dd HH:mm:ss";

    @Override
    public Object processArrayValue(Object value, JsonConfig jsonConfig) {
        return null;
    }

    @Override
    public Object processObjectValue(String key, Object value,
            JsonConfig jsonConfig) {
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
        
        if (value != null)
            return sdf.format(value);
        else {
            return "";
        }
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }
}
