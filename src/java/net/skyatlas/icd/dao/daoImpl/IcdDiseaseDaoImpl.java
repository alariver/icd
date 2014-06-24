/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.dao.daoImpl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.sql.DataSource;
import net.skyatlas.icd.dao.IcdDiseaseDao;
import net.skyatlas.icd.domain.IcdDisease;
import net.skyatlas.icd.domain.IcdDiseaseIdxRelation;
import net.skyatlas.icd.domain.IcdDiseaseIndex;
import net.skyatlas.icd.domain.IcdDiseaseRelation;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;



/**
 *
 * @author changzhenghe
 */
public class IcdDiseaseDaoImpl implements IcdDiseaseDao {
    
    private     JdbcTemplate    jdbcTemplate;
    
    public      void    setDataSource(DataSource ds) {
        this.jdbcTemplate = new JdbcTemplate(ds);
    }

    @Override
    public List<IcdDisease> getAllDisease() {
return this.jdbcTemplate.query("select * from tblicd_dis", new IcdDisRowMapper());
    }

    @Override
    public List<IcdDisease> getDiseasesByType(String type) {
        return this.jdbcTemplate.query("select * from tblicd_dis where code_type = ?", 
                new Object[]{type}, new int[]{Types.CHAR}, new IcdDisRowMapper());
    } ;
        

    @Override
    public IcdDisease getDiseaseByID(Integer id) {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        return (IcdDisease)this.jdbcTemplate.queryForObject("select * from tblicd_dis where id = ?", new Object[]{id}, new IcdDisRowMapper());
    }

    @Override
    public IcdDisease getDiseaseByIcdcode(String icdCode) {
        return (IcdDisease)this.jdbcTemplate.queryForObject("select * from tblicd_dis where icd_code = ?", new Object[]{icdCode}, new IcdDisRowMapper());
    }

    @Override
    public List<IcdDisease> findDiseasesByStarCode(String starcode) {
        return this.jdbcTemplate.query("select * from tblicd_dis where star_code = ?", new Object[]{starcode}, new IcdDisRowMapper());
    }

    @Override
    public List<IcdDisease> findDiseasesBySwordCode(String swordcode) {
        return this.jdbcTemplate.query("select * from tblicd_dis where sword_code = ?", new Object[]{swordcode}, new IcdDisRowMapper());
    }

    @Override
    public List<IcdDisease> findChildren(Integer pid) {
        return this.jdbcTemplate.query("select * from tblicd_dis where parent_id = ?", new Object[]{pid}, new IcdDisRowMapper());
    }

    @Override
    public List<IcdDisease> findChildren(Integer pid, String codeType) {
        return this.jdbcTemplate.query("select * from tblicd_dis where parent_id = ? and code_type = ?", new Object[]{pid,codeType}, new IcdDisRowMapper());
    }

    @Override
    public List<IcdDiseaseRelation> findRelationsByMainID(Integer mid) {
        return this.jdbcTemplate.query("select * from tblicd_relation_dis where main_id = ?", new Object[]{mid}, new IcdDisRelationMapper());
    }

    @Override
    public List<IcdDiseaseRelation> findRelationsByRefID(Integer rid) {
        return this.jdbcTemplate.query("select * from tblicd_relation_dis where reference_id = ?", new Object[]{rid}, new IcdDisRelationMapper());
    }

    @Override
    public List<IcdDiseaseIndex> getAllDiseaseIndexes() {
        return this.jdbcTemplate.query("select * from tblindex_dis", new IcdIndexDiseaseMapper());
    }

    @Override
    public List<IcdDiseaseIndex> getDiseaseIdxesByDepth(int depth) {
        return this.jdbcTemplate.query("select * from tblindex_dis where depth = ?", new Object[]{depth}, new IcdIndexDiseaseMapper());
    }

    @Override
    public List<IcdDiseaseIndex> getDiseaseIdxesByKeyword(String keyword) {
        // 判断输入参数是否中文
        String py = "\\w+";
        Pattern p = Pattern.compile(py);
        Matcher m = p.matcher(keyword);
        if (m.matches()) {  // 字母拼音
            return this.jdbcTemplate.query("select * from tblindex_dis where py like ?",new Object[]{"%"+keyword+"%"}, new IcdIndexDiseaseMapper());
        }
        else {
            return this.jdbcTemplate.query("select * from tblindex_dis where name_ch like ?",new Object[]{"%"+keyword+"%"}, new IcdIndexDiseaseMapper());
        }
    }

    @Override
    public IcdDiseaseIndex getDiseaseIdxByID(Integer id) {
        return (IcdDiseaseIndex)this.jdbcTemplate.queryForObject("select * from tblindex_dis where id = ?", new Object[]{id}, new IcdIndexDiseaseMapper());
    }

    @Override
    public List<IcdDiseaseIdxRelation> findIdxRelationsByMainID(Integer mid) {
        return this.jdbcTemplate.query("select * from tblindex_relation_dis where main_id = ?", new Object[]{mid}, new IcdIdxDiseaseRelationMapper());
    }

    @Override
    public List<IcdDiseaseIdxRelation> findIdxRelationsByRefID(Integer rid) {
        return this.jdbcTemplate.query("select * from tblindex_relation_dis where reference_id = ?", new Object[]{rid}, new IcdIdxDiseaseRelationMapper());
    }

    @Override
    public List<String> getAliasesByIndexid(Integer indexid) {
        return this.jdbcTemplate.queryForList("select name from tblalias where index_id =?", new Object[]{indexid}, String.class);
    }
    @Override
    public int addAliasesByIndexid(Integer indexid,String alias){
        return this.jdbcTemplate.update("INSERT INTO tblalias(name,index_id) VALUES(?,?)", new Object[]{alias,indexid});
    }
     @Override
    public void deleteAliasesByID(Integer id) {
          this.jdbcTemplate.
    }

    @Override
    public void deleteAliasesByAlias(String alias) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void updateAliasesByID(Integer id) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    @Override
    public void editDisease(IcdDisease dis){
           this.jdbcTemplate.update("update tblicd_dis set code_name_ch =? "
                   + ",code_name_en=?,abbreviation_ch=? "
                   + ",abbreviation_en=?,py=? "
                   + ",parent_id=?,page=? "
                   + ",note_ch=?,note_en=? "
                   + ",full_name=?,code_type=? "
                   + ",icd_code=?,star_code=? "
                   + ",sword_code=? "
                   + " where id=?", new Object[]{dis.getCodeNameCh()
                   ,dis.getCodeNameEn(),dis.getAbbreviationCh()
                   ,dis.getAbbreviationEn(),dis.getPy()
                   ,dis.getParentID(),dis.getPage()
                   ,dis.getNoteCh(),dis.getNoteEn()
                   ,dis.getFullName(),dis.getCodeType()
                   ,dis.getIcdCode(),dis.getStarCode()
                   ,dis.getSwordCode()
                   ,dis.getId()});
            
    }

    @Override
    public void editDiseaseIndex(IcdDiseaseIndex disIndex) {
            this.jdbcTemplate.update("UPDATE tblindex_dis SET name_ch=?,name_en=?,"
                    + "page=?,star_code=?,"
                    + "icd_code=?,see_condition=?,"
                    + "see_also_condition=?,m_code=?,"
                    + "note_ch=?,note_en=?,"
                    + "parent_id=?,depth=?,"
                    + "abbreviation_ch=?,abbreviation_en=?,"
                    + "py=?,full_name=?,"
                    + "class=?,star_code_id=?,"
                    + "icd_code_id=?,tumer=?,"
                    + "type=?,path=? "
                    + " where id=?", new Object[]{disIndex.getNameCh(),disIndex.getNameEn(),
                    disIndex.getPage(),disIndex.getStarCode(),
                    disIndex.getIcdCode(),disIndex.isSeeCondition(),
                    disIndex.isSeeAlsoCondition(),disIndex.getMcode(),
                    disIndex.getNoteCh(),disIndex.getNoteEn(),
                    disIndex.getParentID(),disIndex.getDepth(),
                    disIndex.getAbbreviationCh(),disIndex.getAbbreviationEn(),
                    disIndex.getPy(),disIndex.getFullName(),
                    disIndex.getAlphaClass(),disIndex.getStarCodeID(),
                    disIndex.getIcdCodeID(),disIndex.isTumer(),
                    disIndex.getIndexType(),disIndex.getPathStr(),
                    disIndex.getId()});
    }

   
}
class IcdDisRowMapper implements RowMapper {

    public IcdDisRowMapper() {
    }

    @Override
    public IcdDisease mapRow(ResultSet rs, int i) throws SQLException {
        IcdDisease icd = new IcdDisease();
        icd.setId(rs.getInt(1));
        icd.setCodeNameCh(rs.getString(2));
        icd.setCodeNameEn(rs.getString(3));
        icd.setAbbreviationCh(rs.getString(4));
        icd.setAbbreviationEn(rs.getString(5));
        icd.setPy(rs.getString(6));
        icd.setParentID(rs.getInt(7));
        icd.setPage(rs.getInt(8));
        icd.setNoteCh(rs.getString(9));
        icd.setNoteEn(rs.getString(10));
        icd.setFullName(rs.getString(11));
        icd.setCodeType(rs.getString(12));
        icd.setIcdCode(rs.getString(13));
        icd.setStarCode(rs.getString(14));
        icd.setSwordCode(rs.getString(15));
        icd.setHasChildren(rs.getBoolean(16));
        return icd;
    }

}

class IcdDisRelationMapper implements RowMapper {

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

class   IcdIndexDiseaseMapper implements RowMapper {

    @Override
    public Object mapRow(ResultSet rs, int i) throws SQLException {
        IcdDiseaseIndex e = new IcdDiseaseIndex();
        e.setId(rs.getInt(1));
        e.setNameCh(rs.getString(2));
        e.setNameEn(rs.getString(3));
        e.setPage(rs.getInt(4));
        e.setStarCode(rs.getString(5));
        e.setIcdCode(rs.getString(6));
        e.setSeeCondition(rs.getBoolean(7));
        e.setSeeAlsoCondition(rs.getBoolean(8));
        e.setMcode(rs.getString(9));
        e.setNoteCh(rs.getString(10));
        e.setNoteEn(rs.getString(11));
        e.setParentID(rs.getInt(12));
        e.setDepth(rs.getInt(13));
        e.setAbbreviationCh(rs.getString(14));
        e.setAbbreviationEn(rs.getString(15));
        e.setPy(rs.getString(16));
        e.setFullName(rs.getString(17));
        e.setAlphaClass(rs.getString(18));
        e.setStarCodeID(rs.getInt(19));
        e.setIcdCodeID(rs.getInt(20));
        e.setTumer(rs.getBoolean(21));
        e.setIndexType(rs.getInt(22));
        e.setHasChildren(rs.getBoolean(23));
        e.setPathStr(rs.getString(24));
        e.setReferID(rs.getInt(25));
        e.setReferAlsoID(rs.getInt(26));
        e.setHasAlias(rs.getBoolean(27));
        return e;
    }
    
}

class IcdIdxDiseaseRelationMapper implements RowMapper {

    @Override
    public Object mapRow(ResultSet rs, int i) throws SQLException {
        IcdDiseaseIdxRelation e = new IcdDiseaseIdxRelation();
        e.setId(rs.getInt(1));
        e.setMainID(rs.getInt(2));
        e.setRelationContentCh(rs.getString(3));
        e.setRelationContentEn(rs.getString(4));
        e.setRelationType(rs.getString(5));
        e.setReferenceID(rs.getInt(6));
        e.setBySite(rs.getBoolean(7));
        e.setNoteCh(rs.getString(8));
        return e;
    }
    
}
