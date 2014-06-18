/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;

/**
 *
 * @author changzhenghe
 * 
 * ICD Vol1
 * Table : tblicd_dis
 */
public class IcdDisease {
    private         Integer         id;
    private         String          codeNameCh;             // 中文编码名称
    private         String          codeNameEn;             // 英文编码名称
    private         String          abbreviationCh;         // 中文简称
    private         String          abbreviationEn;         // 英文简称
    private         String          py;                     // 拼音首字母
    private         Integer         parentID;               // 上一级记录ID
    private         Integer         page;                   // 对应字典中的页码
    private         String          noteCh;                 // 中文注释
    private         String          noteEn;                 // 英文注释
    private         String          icdCode;                // 对应的ICD编码
    private         String          starCode;               // 星号编码
    private         String          swordCode;              // 剑号编码
    private         String          codeType;               // 章 节 类目 亚目 包含 ?组  ?组2
    private         boolean         hasChildren;            // 是否存在下级目录
    private         String          fullName;
    
    private         HashMap<String,List<IcdDiseaseRelation>>      refRelations;       // 记录 不包括 包括 另编码  星剑 关系
    private         HashMap<String,List<IcdDiseaseRelation>>      referencedRelations;    // 被那些关系引用
    
    // 在memory grid初始化时，统一设置，不直接从数据库中获取
    private         IcdDisease      parentDisease;
    private         List<IcdDisease>    children;

    public IcdDisease getParentDisease() {
        return parentDisease;
    }

    public void setParentDisease(IcdDisease parentDisease) {
        this.parentDisease = parentDisease;
    }

    public List<IcdDisease> getChildren() {
        return children;
    }

    public void setChildren(List<IcdDisease> children) {
        this.children = children;
    }
    
    

    public HashMap<String, List<IcdDiseaseRelation>> getRefRelations() {
        return refRelations;
    }

    public void setRefRelations(HashMap<String, List<IcdDiseaseRelation>> refRelations) {
        this.refRelations = refRelations;
    }

    public HashMap<String, List<IcdDiseaseRelation>> getReferencedRelations() {
        return referencedRelations;
    }

    public void setReferencedRelations(HashMap<String, List<IcdDiseaseRelation>> referencedRelations) {
        this.referencedRelations = referencedRelations;
    }
    
    

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    

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

    public String getCodeNameEn() {
        return codeNameEn;
    }

    public void setCodeNameEn(String codeNameCn) {
        this.codeNameEn = codeNameCn;
    }

    public String getAbbreviationCh() {
        return abbreviationCh;
    }

    public void setAbbreviationCh(String abbreviationCh) {
        this.abbreviationCh = abbreviationCh;
    }

    public String getAbbreviationEn() {
        return abbreviationEn;
    }

    public void setAbbreviationEn(String abbreviationEn) {
        this.abbreviationEn = abbreviationEn;
    }

    public String getPy() {
        return py;
    }

    public void setPy(String py) {
        this.py = py;
    }

    public Integer getParentID() {
        return parentID;
    }

    public void setParentID(Integer parentID) {
        this.parentID = parentID;
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

    public String getNoteEn() {
        return noteEn;
    }

    public void setNoteEn(String noteEn) {
        this.noteEn = noteEn;
    }

    public String getIcdCode() {
        return icdCode;
    }

    public void setIcdCode(String icdCode) {
        this.icdCode = icdCode;
    }

    public String getStarCode() {
        return starCode;
    }

    public void setStarCode(String starCode) {
        this.starCode = starCode;
    }

    public String getSwordCode() {
        return swordCode;
    }

    public void setSwordCode(String swordCode) {
        this.swordCode = swordCode;
    }

    public String getCodeType() {
        return codeType;
    }

    public void setCodeType(String codeType) {
        this.codeType = codeType;
    }

    public boolean isHasChildren() {
        return hasChildren;
    }

    public void setHasChildren(boolean hasChildren) {
        this.hasChildren = hasChildren;
    }

    @Override
    public String toString() {
        return "IcdDisease{" + "codeNameCh=" + codeNameCh + ", codeNameEn=" + codeNameEn + ", abbreviationCh=" + abbreviationCh + ", abbreviationEn=" + abbreviationEn + ", py=" + py + ", parentID=" + parentID + ", page=" + page + ", noteCh=" + noteCh + ", noteEn=" + noteEn + ", icdCode=" + icdCode + ", starCode=" + starCode + ", swordCode=" + swordCode + ", codeType=" + codeType + ", hasChildren=" + hasChildren + '}';
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 71 * hash + Objects.hashCode(this.id);
        hash = 71 * hash + Objects.hashCode(this.codeNameCh);
        hash = 71 * hash + Objects.hashCode(this.codeNameEn);
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
        final IcdDisease other = (IcdDisease) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
    
    /*
        获取疾病的完整描述
    */
    public  String  getDiseaseFullDescription() {
        String ret = "";
        if (this.parentDisease != null && !this.parentDisease.getCodeType().equals("章") && !this.parentDisease.getCodeType().equals("节")) {
            ret += "\t" + this.parentDisease.getDiseaseFullDescription();
        }
        ret = ret + "\t" + this.getCodeNameCh();
        
        // children && code_type == '包含'
        if (this.children != null) {
            ret += "包含: ";
            for (IcdDisease d : this.children) {
                ret += d.getCodeNameCh() + " ";
            }
        }
        
        return ret;
    }
}
