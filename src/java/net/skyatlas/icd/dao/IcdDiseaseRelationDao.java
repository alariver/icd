/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.dao;

import java.util.List;
import net.skyatlas.icd.domain.IcdDiseaseRelation;

 

/**
 *
 * @author cjl
 */
public interface IcdDiseaseRelationDao {
    /**
     * 获取所有vol1的关系
     * @return 
     */
   List<IcdDiseaseRelation> getAllDiseaseRelation();
   /**
    * 修改 relation
    * @param disRelation 
    */
   public void editDiseaseRelation(IcdDiseaseRelation dr);
}
