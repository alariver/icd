/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.domain;

import java.util.Objects;

/**
 *  肿瘤形态学编码
 * @author changzhenghe
 */
public class IcdMCode {
    private             Integer             id;
    private             String              codeNameCh;         // 中文描述
    private             String              codeo;              // M Code
    private             String              refCode;            // 相关编码（肿瘤表）
    private             String              refid;
    private             Integer             page;
    private             String              noteCh;
    private             Integer             type;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCodeNameCh() {
        return codeNameCh;
    }

    public void setCodeNameCh(String codeNameCh) {
        this.codeNameCh = codeNameCh;
    }

    public String getCodeo() {
        return codeo;
    }

    public void setCodeo(String codeo) {
        this.codeo = codeo;
    }

    public String getRefCode() {
        return refCode;
    }

    public void setRefCode(String refCode) {
        this.refCode = refCode;
    }

    public String getRefid() {
        return refid;
    }

    public void setRefid(String refid) {
        this.refid = refid;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public String getNoteCh() {
        return noteCh;
    }

    public void setNoteCh(String noteCh) {
        this.noteCh = noteCh;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 53 * hash + Objects.hashCode(this.id);
        hash = 53 * hash + Objects.hashCode(this.codeNameCh);
        hash = 53 * hash + Objects.hashCode(this.codeo);
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
        final IcdMCode other = (IcdMCode) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
    
    
}
