package cn.itcast.ssm.mapper;

import cn.itcast.ssm.po.Emailuser;
import cn.itcast.ssm.po.EmailuserExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface EmailuserMapper {
    int countByExample(EmailuserExample example);

    int deleteByExample(EmailuserExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(Emailuser record);

    int insertSelective(Emailuser record);

    List<Emailuser> selectByExample(EmailuserExample example);

    Emailuser selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") Emailuser record, @Param("example") EmailuserExample example);

    int updateByExample(@Param("record") Emailuser record, @Param("example") EmailuserExample example);

    int updateByPrimaryKeySelective(Emailuser record);

    int updateByPrimaryKey(Emailuser record);
}