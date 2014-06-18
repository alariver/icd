/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.domain;

import java.util.Objects;

/**
 *
 * @author changzhenghe
 */
public class IcdTumorList {
    private             Integer             id;
    private             String              pmcode;         // 恶性 原发
    private             String              smcode;         // 恶性 继发
    private             String              insitucode;     // 原位
    private             String              benigncode;     // 良性
    private             String              dynamiccode;    // 动态未定或未知
    private             String              indexid;        // 对应Vol 3 “解剖部位” 的编码

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPmcode() {
        return pmcode;
    }

    public void setPmcode(String pmcode) {
        this.pmcode = pmcode;
    }

    public String getSmcode() {
        return smcode;
    }

    public void setSmcode(String smcode) {
        this.smcode = smcode;
    }

    public String getInsitucode() {
        return insitucode;
    }

    public void setInsitucode(String insitucode) {
        this.insitucode = insitucode;
    }

    public String getBenigncode() {
        return benigncode;
    }

    public void setBenigncode(String benigncode) {
        this.benigncode = benigncode;
    }

    public String getDynamiccode() {
        return dynamiccode;
    }

    public void setDynamiccode(String dynamiccode) {
        this.dynamiccode = dynamiccode;
    }

    public String getIndexid() {
        return indexid;
    }

    public void setIndexid(String indexid) {
        this.indexid = indexid;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 19 * hash + Objects.hashCode(this.id);
        hash = 19 * hash + Objects.hashCode(this.pmcode);
        hash = 19 * hash + Objects.hashCode(this.smcode);
        hash = 19 * hash + Objects.hashCode(this.insitucode);
        hash = 19 * hash + Objects.hashCode(this.benigncode);
        hash = 19 * hash + Objects.hashCode(this.dynamiccode);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final IcdTumorList other = (IcdTumorList) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
    
    
}
