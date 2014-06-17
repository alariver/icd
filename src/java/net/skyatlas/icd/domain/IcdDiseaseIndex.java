/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import net.skyatlas.icd.util.parseTree.ParseTreeResultNode;

/**
 *
 * @author changzhenghe
 * ICD VOl3
 */
public class IcdDiseaseIndex {
    private             Integer             id;
    private             String              nameCh;
    private             String              nameEn;
    private             Integer             page;
    private             String              starCode;
    private             String              icdCode;
    private             boolean             seeCondition;
    private             boolean             seeAlsoCondition;
    private             String              mcode;                  // 形态学编码
    private             String              noteCh;
    private             String              noteEn;
    private             Integer             parentID;               // pid
    private             Integer             depth;
    private             String              abbreviationCh;
    private             String              abbreviationEn;
    private             String              py;
    private             String              fullName;
    private             String              alphaClass;
    private             Integer             starCodeID;             // 星号编码对应ID
    private             Integer             icdCodeID;              // icd Code ID
    private             boolean             tumer;
    private             Integer             indexType;              // 0: 第一索引,  1: 第二索引,  2: 药物化学制剂表
    private             boolean             hasChildren;
    private             String              pathStr;
    private             Integer             referID;                // 见
    private             Integer             referAlsoID;            // 另见
    private             boolean             hasAlias;
    
    private             String[]            aliases;
    private             HashMap<String, List<IcdDiseaseIdxRelation>>          idxRelations;
    
    private                 ParseTreeResultNode   parseTreeRoot;        // 当本条目为主导词 存放 主导词的Parse Tree
    
    private             String              shortDesc;
    
    //在memory grid初始化时，统一设置，不直接从数据库中获取
    private IcdDiseaseIndex parentDiseaseIndex;
    private List<IcdDiseaseIndex> children;
    
    public String getShortDesc() {
        return nameCh + "\t{P"+page+"页, ICD Code:"+icdCode+", *Code:"+starCode+", Depth:"+depth+"}";
    }
    
    

    @Override
    public String toString() {
        return "IcdDiseaseIndex{" + "id=" + id + ", nameCh=" + nameCh + ", nameEn=" + nameEn + ", page=" + page + ", starCode=" + starCode + ", icdCode=" + icdCode + ", seeCondition=" + seeCondition + ", seeAlsoCondition=" + seeAlsoCondition + ", mcode=" + mcode + ", noteCh=" + noteCh + ", noteEn=" + noteEn + ", parentID=" + parentID + ", depth=" + depth + ", abbreviationCh=" + abbreviationCh + ", abbreviationEn=" + abbreviationEn + ", py=" + py + ", fullName=" + fullName + ", alphaClass=" + alphaClass + ", starCodeID=" + starCodeID + ", icdCodeID=" + icdCodeID + ", tumer=" + tumer + ", indexType=" + indexType + ", hasChildren=" + hasChildren + ", pathStr=" + pathStr + ", referID=" + referID + ", referAlsoID=" + referAlsoID + ", hasAlias=" + hasAlias + '}';
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 29 * hash + Objects.hashCode(this.id);
        hash = 29 * hash + Objects.hashCode(this.nameCh);
        hash = 29 * hash + Objects.hashCode(this.abbreviationCh);
        hash = 29 * hash + Objects.hashCode(this.py);
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
        final IcdDiseaseIndex other = (IcdDiseaseIndex) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }

    public String[] getAliases() {
        return aliases;
    }

    public void setAliases(String[] aliases) {
        this.aliases = aliases;
    }

    public HashMap<String, List<IcdDiseaseIdxRelation>> getIdxRelations() {
        return idxRelations;
    }

    public void setIdxRelations(HashMap<String, List<IcdDiseaseIdxRelation>> idxRelations) {
        this.idxRelations = idxRelations;
    }

    public ParseTreeResultNode getParseTreeRoot() {
        
        return parseTreeRoot;
    }

    public void setParseTreeRoot(ParseTreeResultNode parseTreeRoot) {
        this.parseTreeRoot = parseTreeRoot;
    }

    
    
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNameCh() {
        return nameCh;
    }

    public void setNameCh(String nameCh) {
        this.nameCh = nameCh;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public String getStarCode() {
        return starCode;
    }

    public void setStarCode(String starCode) {
        this.starCode = starCode;
    }

    public String getIcdCode() {
        return icdCode;
    }

    public void setIcdCode(String icdCode) {
        this.icdCode = icdCode;
    }

    public boolean isSeeCondition() {
        return seeCondition;
    }

    public void setSeeCondition(boolean seeCondition) {
        this.seeCondition = seeCondition;
    }

    public boolean isSeeAlsoCondition() {
        return seeAlsoCondition;
    }

    public void setSeeAlsoCondition(boolean seeAlsoCondition) {
        this.seeAlsoCondition = seeAlsoCondition;
    }

    public String getMcode() {
        return mcode;
    }

    public void setMcode(String mcode) {
        this.mcode = mcode;
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

    public Integer getParentID() {
        return parentID;
    }

    public void setParentID(Integer parentID) {
        this.parentID = parentID;
    }

    public Integer getDepth() {
        return depth;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAlphaClass() {
        return alphaClass;
    }

    public void setAlphaClass(String alphaClass) {
        this.alphaClass = alphaClass;
    }

    public Integer getStarCodeID() {
        return starCodeID;
    }

    public void setStarCodeID(Integer starCodeID) {
        this.starCodeID = starCodeID;
    }

    public Integer getIcdCodeID() {
        return icdCodeID;
    }

    public void setIcdCodeID(Integer icdCodeID) {
        this.icdCodeID = icdCodeID;
    }

    public boolean isTumer() {
        return tumer;
    }

    public void setTumer(boolean tumer) {
        this.tumer = tumer;
    }

    public Integer getIndexType() {
        return indexType;
    }

    public void setIndexType(Integer indexType) {
        this.indexType = indexType;
    }

    public boolean isHasChildren() {
        return hasChildren;
    }

    public void setHasChildren(boolean hasChildren) {
        this.hasChildren = hasChildren;
    }

    public String getPathStr() {
        return pathStr;
    }

    public void setPathStr(String pathStr) {
        this.pathStr = pathStr;
    }

    public Integer getReferID() {
        return referID;
    }

    public void setReferID(Integer referID) {
        this.referID = referID;
    }

    public Integer getReferAlsoID() {
        return referAlsoID;
    }

    public void setReferAlsoID(Integer referAlsoID) {
        this.referAlsoID = referAlsoID;
    }

    public boolean isHasAlias() {
        return hasAlias;
    }

    public void setHasAlias(boolean hasAlias) {
        this.hasAlias = hasAlias;
    }

    public IcdDiseaseIndex getParentDiseaseIndex() {
        return parentDiseaseIndex;
    }

    public void setParentDiseaseIndex(IcdDiseaseIndex parentDiseaseIndex) {
        this.parentDiseaseIndex = parentDiseaseIndex;
    }

    public List<IcdDiseaseIndex> getChildren() {
        return children;
    }

    public void setChildren(List<IcdDiseaseIndex> children) {
        this.children = children;
    }
    
    
}
