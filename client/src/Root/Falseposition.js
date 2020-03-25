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

class FalsePosition extends Component{

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
              Eq :null,
              xlValue:null,
              xrValue :null,
              result :null,

          }
        }

        componentDidMount()
    {
        
        axios.get('http://localhost:8080/fp.php')
        // axios.get('http://localhost/numer/server/fp.php')
        .then(res=>{
            console.log(res.data);
            let optionsArr = [];
            
            res.data.map(dataMap=>{
                let optionsObj = {};
                if(dataMap.t_type === "falsep")
                {
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
        .catch(err=>{
          throw err;
        })
    }
            


    Equet = (EqForSloveFuntion,xvalueforSlove)=>{
      const NodeEqua = parse(EqForSloveFuntion); 
      const Equa = NodeEqua.compile();
      let scope = {
        x:xvalueforSlove
      }
      return Equa.eval(scope);      
    }
  
  err = (xmold, xmnew)=>{
      var er = ((Math.abs((xmnew - xmold) / xmnew)) * 100) / 100;
      return er;
  }
    getValue = ()=>{
  
      const {Eq,xlValue,xrValue} = this.state;    
      var xl = parseFloat(xlValue);
      var xr = parseFloat(xrValue);
      let tableArrData = [];
      console.log(Eq,xl,xr);
      var fxl = this.Equet(Eq,xl);
      var fxr = this.Equet(Eq,xr);
      var xm = xr - ((fxr * (xl - xr)) / (fxl - fxr))
      console.log(this.state);
      var xmArr = new Array();
      var fxmArr = new Array();
      var xmoldinmain = xm;
      xmArr[0] = xm;
      
      var fxm;
      var i = 0;
      var fixvalueerror = 0.001;
      var errorvalue = 1;
      while (errorvalue >= fixvalueerror) {
          
          if (i != 0) {
            fxl = this.Equet(Eq,xl);
            fxr = this.Equet(Eq,xr);
            xm = xr - ((fxr * (xl - xr)) / (fxl - fxr))
          }
          fxm = this.Equet(Eq,xm);
          if ((fxm * fxl) > 0) {
            xl=xm    
          }
          else {
              xr=xm
          }
          if (i != 0) {
              errorvalue = this.err(xmoldinmain, xm);
              xmoldinmain = xm;
              console.log("If Work");
          }
          let tableObjData = {};
          tableObjData.index = i;
          tableObjData.xl = xl;
          tableObjData.xr = xr;
          tableObjData.xm = xm;
          tableObjData.errorvalue = errorvalue;
          tableArrData.push(tableObjData);
          console.log("XMVALUE = ", xm);
          console.log("I value =", i);
          console.log("This is errorvalue = ", errorvalue);
          console.log("This is fixvalueerror = ", fixvalueerror);
          xmArr[i] = xm;
          fxmArr[i] = fxm;
          i++;
        }
        this.setState({
          dataTable:tableArrData,
          result:xm
        })
        
      }
      equationfp = () =>{
        const formData = new FormData();
        formData.append("n_name",this.state.Eq);
        formData.append("t_type","falsep");
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
        
      }
      showResult=()=>{
        const columns = [
          {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
          },
          {
            title: 'XL',
            dataIndex: 'xl',
            key: 'xl',
          },
          {
            title: 'XR',
            dataIndex: 'xr',
            key: 'xr',
          },
          {
            title: 'XM',
            dataIndex: 'xm',
            key: 'xm',
          },
          {
            title: 'Error',
            dataIndex: 'errorvalue',
            key: 'errorvalue',
          },
        ];
        if(this.state.result!==null)
        {
          return <div>
           <center> <h5>This is Result of False-Position : {this.state.result}</h5></center><br/>
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
    displayRender = (label) => {
      return label[label.length - 1];
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
                   <center><h2>Falseposition</h2></center> 
                 </div>
                              
                           <div>                   
                        <center>   <Cascader options={this.state.options}expandTrigger="hover"displayRender={this.displayRender}onChange={this.onChange}/> </center>
           </div>
           <br></br>
           <div>
           <center><Input placeholder="Input" style={{width:"13em" , marginLeft:"7%" , marginRight:"5%" , marginBottom:"0.5%"}} onChange={e=>this.setState({Eq:e.target.value})}/>
           </center>
           </div>
                          <div> <center><Input placeholder="@num" style={{width:200 ,  margin:20,marginLeft:50}} onChange={e=>this.setState({xlValue:e.target.value})}/></center></div>
                           <center><Input placeholder="@num2" style={{width:200 ,margin:20,marginLeft:50}} onChange={e=>this.setState({xrValue:e.target.value})}/></center>
                         
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
export default FalsePosition;