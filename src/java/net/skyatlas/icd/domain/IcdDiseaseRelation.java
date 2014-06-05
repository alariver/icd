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
 * ICD Disease 之间的关系
 * 
 */
public class IcdDiseaseRelation {
    private             Integer             id;
    private             Integer             parentID;
    private             String              noteCh;
    private             String              noteEn;
    private             Integer             mainID;
    private             String              referenceCode;              // 关系引用的对象 ICD
    private             String              referenceCodeFull;
    private             Integer             referenceID;                // 可能为null
    private             String              relationType;               // 不包括  包括  另编码  星剑
    private             String              relationContentCh;
    private             String              relationContentEn;
    private             Integer             page;
    private             boolean             hasChildren;

    public IcdDiseaseRelation(Integer parentID, String noteCh, String noteEn, Integer mainID, String referenceCode, String referenceCodeFull, Integer referenceID, String relationType, String relationContentCh, String relationContentEn, Integer page, boolean hasChildren) {
        this.parentID = parentID;
        this.noteCh = noteCh;
        this.noteEn = noteEn;
        this.mainID = mainID;
        this.referenceCode = referenceCode;
        this.referenceCodeFull = referenceCodeFull;
        this.referenceID = referenceID;
        this.relationType = relationType;
        this.relationContentCh = relationContentCh;
        this.relationContentEn = relationContentEn;
        this.page = page;
        this.hasChildren = hasChildren;
    }

    public IcdDiseaseRelation() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 19 * hash + Objects.hashCode(this.id);
        hash = 19 * hash + Objects.hashCode(this.parentID);
        hash = 19 * hash + Objects.hashCode(this.relationType);
        hash = 19 * hash + Objects.hashCode(this.relationContentCh);
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
        final IcdDiseaseRelation other = (IcdDiseaseRelation) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
    
    

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getParentID() {
        return parentID;
    }

    public void setParentID(Integer parentID) {
        this.parentID = parentID;
    }

    public String getNoteCh() {
        return noteCh;
    }

    public void setNoteCh(String noteCh) {
        this.noteCh = noteCh;
    }

    public String getNoteEn() {
        return noteEn;
    }

    public void setNoteEn(String noteEn) {
        this.noteEn = noteEn;
    }

    public Integer getMainID() {
        return mainID;
    }

    public void setMainID(Integer mainID) {
        this.mainID = mainID;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    public String getReferenceCodeFull() {
        return referenceCodeFull;
    }

    public void setReferenceCodeFull(String referenceCodeFull) {
        this.referenceCodeFull = referenceCodeFull;
    }

    public Integer getReferenceID() {
        return referenceID;
    }

    public void setReferenceID(Integer referenceID) {
        this.referenceID = referenceID;
    }

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public String getRelationContentCh() {
        return relationContentCh;
    }

    public void setRelationContentCh(String relationContentCh) {
        this.relationContentCh = relationContentCh;
    }

    public String getRelationContentEn() {
        return relationContentEn;
    }

    public void setRelationContentEn(String relationContentEn) {
        this.relationContentEn = relationContentEn;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public boolean isHasChildren() {
        return hasChildren;
    }

    public void setHasChildren(boolean hasChildren) {
        this.hasChildren = hasChildren;
    }
    
    
    
}
