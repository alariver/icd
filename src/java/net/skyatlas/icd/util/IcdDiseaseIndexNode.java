/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.skyatlas.icd.util;

import java.util.List;
import net.skyatlas.icd.domain.IcdDiseaseIndex;

/**
 *
 * @author Administrator
 */
public class IcdDiseaseIndexNode {
    private             IcdDiseaseIndex icdDiseaseIndex;
    private             Integer             id;
    private             List<IcdDiseaseIndex> children;

    public IcdDiseaseIndex getIcdDiseaseIndex() {
        return icdDiseaseIndex;
    }

    public void setIcdDiseaseIndex(IcdDiseaseIndex icdDiseaseIndex) {
        this.icdDiseaseIndex = icdDiseaseIndex;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<IcdDiseaseIndex> getChildren() {
        return children;
    }

    public void setChildren(List<IcdDiseaseIndex> children) {
        this.children = children;
    }

    
}
