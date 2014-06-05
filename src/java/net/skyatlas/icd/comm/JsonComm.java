/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.skyatlas.icd.comm;

import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;


/**
 *
 * @author changzhenghe
 */
public class JsonComm {
    private     CycleDetectionStrategy cds = CycleDetectionStrategy.LENIENT;

    public CycleDetectionStrategy getCds() {
        return cds;
    }

    public void setCds(CycleDetectionStrategy cds) {
        this.cds = cds;
    }
    
    
    
    public      JsonConfig      getCommJsonConfig(CycleDetectionStrategy pcds,String[] excludes) {
        JsonConfig jc = new JsonConfig();
        if (pcds != null) {
            jc.setCycleDetectionStrategy(pcds);
        }
        else {
            jc.setCycleDetectionStrategy(this.cds);
        }
        jc.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor());
        jc.registerJsonValueProcessor(java.sql.Date.class, new DateJsonValueProcessor2());
        jc.setExcludes(excludes);
        
        // 不考虑 反序列化
        
        return jc;
    }
}
