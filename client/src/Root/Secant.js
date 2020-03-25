import React,{Component} from "react";
import { Layout, Menu, Breadcrumb,Button,Table } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import {Link} from "react-router-dom"
import { Input ,Cascader} from 'antd';
import {parse} from "mathjs";
import axios from 'axios';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Secant extends Component{

    state = {
        collapsed: false,
      };
    
      onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
      };
      constructor(props)
    {
        super(props);
        this.state={
            options:[],
            diffs:[],
            Eq:null,
            EqDiff:null,
            Xinitial:null,
            result:null,
            dataTable:[],
            checked:false,
            eqtotal:[],
        }
    }

      componentDidMount()
      {
          
           axios.get('http://localhost:8080/secant.php')
          // axios.get('http://localhost/numer/server/secant.php')

          .then(res=>{
              console.log(res.data);
              let item =[];
              let optionsArr = [];
              res.data.map(dataMap=>{
                  let optionsObj = {};
                  if(dataMap.t_type === "secant")
                  {
                      item = item.concat(dataMap.n_name);
                      optionsObj.value = dataMap.n_name;
                      optionsObj.label = dataMap.n_name;
                      optionsArr.push(optionsObj);
                      console.log(optionsObj);
                  }
              })
              this.setState({
                  options:optionsArr
              })
          })
      }
  
      Equet = (EqForSloveFuntion,xvalueforSlove) => {
     
        const NodeEqua = parse(EqForSloveFuntion); 
        const Equa = NodeEqua.compile();     
        let scope = {
            x:xvalueforSlove
        }
        return Equa.eval(scope);
         
    }
    
    err = (xmold, xmnew) => {
        var er = ((Math.abs((xmnew - xmold) / xmnew)) * 100) ;
        return er;
    }
    
    getValue = () => {
        const {Eq,Xinitial,Xinitialminus1} = this.state;
        var xi_inmain = parseFloat(Xinitial);
        var xi_minus1_inmain = parseFloat(Xinitialminus1);
        var xi_plus1;
        var fpx_inmainValue;
        let tableArrData = [];
        var errorValue = 1;
        var fixerrorValue =0.0001;
        var i=0;
        while(errorValue>=fixerrorValue)
        {
          xi_plus1=xi_inmain-((this.Equet(Eq,xi_inmain)*(xi_minus1_inmain-xi_inmain))/(this.Equet(Eq,xi_minus1_inmain)-this.Equet(Eq,xi_inmain)));
          errorValue=this.err(xi_plus1,xi_inmain);
  
  
            let tableObjData = {};
            tableObjData.index = i;
            tableObjData.xi_plus1 = xi_plus1;
            tableObjData.errorValue = errorValue;
            tableArrData.push(tableObjData);
            // var row = table.insertRow(i);
    
            // var cel0 = row.insertCell(0);
            // var cel1 = row.insertCell(1);
            // var cel2 = row.insertCell(2);
            
            
    
            // cel0.innerHTML = i;
            // cel1.innerHTML = xi_plus1;
            // cel2.innerHTML = errorValue;
            
            
    
            console.log("Secant XiVALUE = ", xi_plus1);
            console.log("This is errorvalue = ", errorValue);
            console.log("This is fixvalueerror = ", fixerrorValue);
            xi_inmain=xi_plus1;
            i++;
        }
        this.setState({
          dataTable:tableArrData,
          result:xi_plus1
        })
    }
  
  
    showResult=()=>{
      const columns = [
        {
          title: 'No',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: 'X',
          dataIndex: 'xi_plus1',
          key: 'xi_plus1',
        },
        {
          title: 'Error',
          dataIndex: 'errorValue',
          key: 'errorValue',
        },
      ];
      if(this.state.result!==null)
      {
        return <div>
         <center> <h5>    This is Result of secant : {this.state.result}</h5></center><br/>
          <Table dataSource={this.state.dataTable} columns={columns} rowKey="Index" style={{marginLeft:"5%" , marginRight:"5%" , background:"lightblue" }} size="middle"/>
        </div>
  
      }
    }
  
      onChange = (value) => {
        console.log(value[0]);
        this.setState({
          Eq:value[0]
        })
      }
      
      // Just show the latest item.
      displayRender = (label) => {
        return label[label.length - 1];
      }
      Equationsecant = () =>{
        const formData = new FormData();
        formData.append("n_name",this.state.Eq);
        formData.append("t_type","secant");
        formData.append("_dif","");
        const config = {
          headers: {
              "content-type": "multipart/form-data"
              }
          };
          axios.post('http://localhost:8080/add.php',formData,config)
        .then(res=>{
          console.log(res);
        })
        .catch(err=>{
           throw err 
        })
        this.myFunction()
      }
    
      render() {
        return (
          
          <div>
                  <Layout>
          <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>

        <Menu.Item key="0"><Link to="/"/>
          <HomeOutlined />
          <span className="nav-text">HOME</span>

        </Menu.Item>
        
        <SubMenu
          key="sub1"
          title={
            <span>
              <MailOutlined />
              <span>Root</span>
            </span>
          }
        >
            <Menu.Item key="1"><Link to="/Bisection"/>
                <UserOutlined />
                <span className="nav-text">Bisection</span>         
            </Menu.Item>
            <Menu.Item key="2"><Link to="/FalsePosition"/>
                <UserOutlined />
                <span className="nav-text">False Position</span>         
            </Menu.Item>
            <Menu.Item key="3"><Link to="/Onepoint"/>
                <UserOutlined />
                <span className="nav-text">One point</span>         
            </Menu.Item>
            <Menu.Item key="4"><Link to="/Newton"/>
                <UserOutlined />
                <span className="nav-text">Newton</span>  
            </Menu.Item>    
            <Menu.Item key="5"><Link to="/Secant"/>
                <UserOutlined />
                <span className="nav-text">Secant</span>               
            </Menu.Item>
        </SubMenu>


      </Menu>
    </Sider>
    
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Header className="site-layout-background" style={{ padding: 0 }} />
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
      <div className="box" style={{ padding: 24, minHeight: 500 }}>
                 
                 <div >
                   <center><h2>Secant</h2></center> 
                 </div>
                              
                           <div>                   
                        <center>  <Cascader options={this.state.options}expandTrigger="hover"displayRender={this.displayRender}onChange={this.onChange}/> </center>
           </div>
           <br></br>
           <div>
           <center><Input placeholder="Input" style={{width:"13em" , marginLeft:"7%" , marginRight:"5%" , marginBottom:"0.5%"}} onChange={e=>this.setState({Eq:e.target.value})}/>
           </center>
           </div>
                          <div> <center><Input placeholder="x" style={{width:300 ,  margin:20,marginLeft:400}} onChange={e=>this.setState({Xinitial:e.target.value})}/></center></div>
                           <center><Input placeholder="l" style={{width:300 ,margin:20,marginLeft:400}} onChange={e=>this.setState({Xinitialminus1:e.target.value})}/></center>
                         
                           <p>
                           
          <center> <Button onClick={this.getValue}>SUBMIT</Button> </center>
                        </p>
         <br/>
         {this.showResult()}
               </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>@Yot Natrsiri</Footer>
    </Layout>
  </Layout>,
  
        </div>
            )
      }
}
export default Secant;