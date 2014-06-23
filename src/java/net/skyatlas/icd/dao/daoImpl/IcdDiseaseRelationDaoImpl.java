/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.dao.daoImpl;

 
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import javax.sql.DataSource;
import net.skyatlas.icd.dao.IcdDiseaseRelationDao;
import net.skyatlas.icd.domain.IcdDiseaseRelation;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;


/**
 *
 * @author cjl
 */
public class IcdDiseaseRelationDaoImpl implements IcdDiseaseRelationDao {
    
    private     JdbcTemplate    jdbcTemplate;
    
    public      void    setDataSource(DataSource ds) {
        this.jdbcTemplate = new JdbcTemplate(ds);
    }

    @Override
    public List<IcdDiseaseRelation> getAllDiseaseRelation() {
        
        return this.jdbcTemplate.query("select * from tblicd_relation_dis", new IcdDisRelation1Mapper());
     
    }

    @Override
    public void editDiseaseRelation(IcdDiseaseRelation dr) {
        this.jdbcTemplate.update("update tblicd_relation_dis "
                + "set parent_id =? ,"
                + "note_ch =? ,"
                + "note_en =? ,"
                + "main_id =? ,"
                + "reference_code=?,"
                + "reference_code_full = ? ,"
                + "reference_id=?,"
                + "relation_type=?,"
                + "relation_content_ch = ?,"
                + "relation_content_en = ?,"
                + "page=? "
                + "where id= ?", new Object[]{
                    dr.getParentID(),
                    dr.getNoteCh(),
                    dr.getNoteEn(),
                    dr.getMainID(),
                    dr.getReferenceCode(),
                    dr.getReferenceCodeFull(),
                    dr.getReferenceID(),
                    dr.getRelationType(),
                    dr.getRelationContentCh(),
                    dr.getRelationContentEn(),
                    dr.getPage(),
                    dr.getId()
                });
    }
    
    
}
class IcdDisRelation1Mapper implements RowMapper {

    @Override
    public Object mapRow(ResultSet rs, int i) throws SQLException {
        IcdDiseaseRelation icdRel = new IcdDiseaseRelation();
        icdRel.setId(rs.getInt(1));
        icdRel.setParentID(rs.getInt(2));
        icdRel.setNoteCh(rs.getString(3));
        icdRel.setNoteEn(rs.getString(4));
        icdRel.setMainID(rs.getInt(5));
        icdRel.setReferenceCode(rs.getString(6));
        icdRel.setReferenceCodeFull(rs.getString(7));
        icdRel.setReferenceID(rs.getInt(8));
        icdRel.setRelationType(rs.getString(9));
        icdRel.setRelationContentCh(rs.getString(10));
        icdRel.setRelationContentEn(rs.getString(11));
        icdRel.setPage(rs.getInt(12));
        icdRel.setHasChildren(rs.getBoolean(13));
        return icdRel;
    }

}