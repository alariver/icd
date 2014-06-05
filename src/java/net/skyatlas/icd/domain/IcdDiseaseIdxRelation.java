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
 * Vol3 条目之间的关系， 主要是 见、另见
 */
public class IcdDiseaseIdxRelation {
    private             Integer                 id;
    private             Integer                 mainID;
    private             String                  relationContentCh;
    private             String                  relationContentEn;
    private             String                  relationType;           // 见  另见
    private             Integer                 referenceID;
    private             boolean                 bySite;                 // 按部位
    private             String                  noteCh;                 // 备注

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMainID() {
        return mainID;
    }

    public void setMainID(Integer mainID) {
        this.mainID = mainID;
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

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public Integer getReferenceID() {
        return referenceID;
    }

    public void setReferenceID(Integer referenceID) {
        this.referenceID = referenceID;
    }

    public boolean isBySite() {
        return bySite;
    }

    public void setBySite(boolean bySite) {
        this.bySite = bySite;
    }

    public String getNoteCh() {
        return noteCh;
    }

    public void setNoteCh(String noteCh) {
        this.noteCh = noteCh;
    }

    @Override
    public String toString() {
        return "IcdDiseaseIdxRelation{" + "id=" + id + ", mainID=" + mainID + ", relationContentCh=" + relationContentCh + ", relationContentEn=" + relationContentEn + ", relationType=" + relationType + ", referenceID=" + referenceID + ", bySite=" + bySite + ", noteCh=" + noteCh + '}';
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 53 * hash + Objects.hashCode(this.id);
        hash = 53 * hash + Objects.hashCode(this.relationContentCh);
        hash = 53 * hash + Objects.hashCode(this.relationType);
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
        final IcdDiseaseIdxRelation other = (IcdDiseaseIdxRelation) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
    
    
}
