/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.util;

import net.skyatlas.icd.domain.IcdDiseaseIndex;

/**
 *
 * @author changzhenghe
 */
public class IcdIndexDiseaseShowObj {
    private     String      id;
    private     String      parentID;
    private     String      shortDesc;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getParentID() {
        return parentID;
    }

    public void setParentID(String parentID) {
        this.parentID = parentID;
    }

    public String getShortDesc() {
        return shortDesc;
    }

    public void setShortDesc(String shortDesc) {
        this.shortDesc = shortDesc;
    }

    public IcdIndexDiseaseShowObj(String id, String parentID, String shortDesc) {
        this.id = id;
        this.parentID = parentID;
        this.shortDesc = shortDesc;
    }
    
    public  IcdIndexDiseaseShowObj(IcdDiseaseIndex index) {
        this.id = index.getId()+"";
        this.parentID = index.getParentID()+"";
        this.shortDesc = index.getShortDesc();
    }
    
    
}
