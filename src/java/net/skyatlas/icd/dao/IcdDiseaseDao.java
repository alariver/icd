/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.dao;

import java.util.List;
import net.skyatlas.icd.domain.IcdDisease;
import net.skyatlas.icd.domain.IcdDiseaseIdxRelation;
import net.skyatlas.icd.domain.IcdDiseaseIndex;
import net.skyatlas.icd.domain.IcdDiseaseRelation;

/**
 *
 * @author changzhenghe
 */
public interface IcdDiseaseDao {
    /*
        获取所有Vol1 信息
    */
    List<IcdDisease> getAllDisease();
    
    /*
        根据类型获取Vol1 表信息
    */
    List<IcdDisease> getDiseasesByType(String type);
    
    /*
        根据ID获取数据
    */
    IcdDisease getDiseaseByID(Integer id);
    
    /*
        根据ICD Code获取
    */
    IcdDisease  getDiseaseByIcdcode(String icdCode);
    
    /*
        根据星号查询
    */
    List<IcdDisease>    findDiseasesByStarCode(String starcode);
    
    /*
        根据剑号查询
    */
    List<IcdDisease>    findDiseasesBySwordCode(String swordcode);
    
    /*
        获取Children
        根据Parent ID
    */
    List<IcdDisease>    findChildren(Integer pid);
    
    /*
        获取Children
        根据ParentID， Code Type
    */
    List<IcdDisease>    findChildren(Integer pid, String codeType);
    
    /*
        根据main id，获取相关的disease relation
    */
    List<IcdDiseaseRelation>    findRelationsByMainID(Integer mid);
    
    /*
        根据 reference id，获取相关disease relation
    */
    List<IcdDiseaseRelation>    findRelationsByRefID(Integer rid);
    
    /****    卷三      ******/
    /*
        获取所有卷三条目
    */
    List<IcdDiseaseIndex>   getAllDiseaseIndexes();
    
    /*
        根据 Depth 获取卷三条目
    */
    List<IcdDiseaseIndex>   getDiseaseIdxesByDepth(int depth);          // depth->0, 主导词
    
    /*
        根据主导词定位 Vol 3 条目
    
    */
    List<IcdDiseaseIndex>   getDiseaseIdxesByKeyword(String keyword);
    
    /*
        根据ID值，直接获取Vol 3 Item
    */
    IcdDiseaseIndex     getDiseaseIdxByID(Integer id);
    
    List<IcdDiseaseIdxRelation>   findIdxRelationsByMainID(Integer mid);
    
    List<IcdDiseaseIdxRelation>   findIdxRelationsByRefID(Integer rid);
    
    /*
        根据ID值， 获取Vol3 Item 的 aliases
    */
    List<String>    getAliasesByIndexid(Integer indexid);
    /**
     * 新增别名
     * @param indexid
     * @param alias
     * @return 
     */
    public int addAliasesByIndexid(Integer indexid,String alias);
    /**
     * 删除别名
     * @param id 
     */
    public void deleteAliasesByID(Integer id);
    /**
     * 删除别名，根据name
     * @param alias 
     */
    public void deleteAliasesByAlias(String alias);
    /**
     * 更新别名
     * @param id 
     */
    public void updateAliasesByID(Integer id);
    /**
     * update
     * @param dis 
     */
    public void editDisease(IcdDisease dis);
    
    /**
     * update
     * @param disIndex 
     */
    public void editDiseaseIndex(IcdDiseaseIndex disIndex);
}
