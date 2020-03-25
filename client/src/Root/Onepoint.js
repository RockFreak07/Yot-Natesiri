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

class Onepoint extends Component{

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
          
          axios.get('http://localhost:8080/one.php')
          // axios.get('http://localhost/numer/server/one.php')

          .then(res=>{
              console.log(res.data);
              let item =[];
              let optionsArr = [];
              res.data.map(dataMap=>{
                  let optionsObj = {};
                  if(dataMap.t_type==="one")
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
    
    err = (xiw1, xi) => {
        var er = ((Math.abs((xiw1 - xi) / xiw1))*100)/100;
        return er;
    }
    
    getValue = () => {
    
        const {Eq,xinitial} = this.state;
        var xiinmain = parseFloat(xinitial);  
        let tableArrData = [];
        console.log(Eq,xiinmain);
        var i=0;
        var xiw1inmain;
        var fixerrorValue = 0.0001;
        var errorValue=1;
        
        while(errorValue >= fixerrorValue)
        {
          xiw1inmain = this.Equet(Eq,xiinmain);
          errorValue= this.err(xiw1inmain,xiinmain);
  
          let tableObjData = {};
          tableObjData.index = i;
          tableObjData.xiinmain = xiinmain;
          tableObjData.xiw1inmain = xiw1inmain;
          tableObjData.errorValue = errorValue;
          tableArrData.push(tableObjData);
          console.log("XMVALUE = ", xiw1inmain);
          console.log("I value =", i);
          console.log("This is errorvalue = ", errorValue);
          console.log("This is fixvalueerror = ", fixerrorValue); 
          xiinmain=xiw1inmain;       
          i++;
        }
        this.setState({
          dataTable:tableArrData,
          result:xiw1inmain
        })
    }
  
    EquationOnePoint = () =>{
      const formData = new FormData();
      formData.append("n_name",this.state.Eq);
      formData.append("t_type","OnePoint");
      formData.append("_dif","");
      const config = {
        headers: {
            "content-type": "multipart/form-data"
            }
        };
      // axios.post('http://localhost:8080/add_equation.php',formData,config)
      axios.post('http://localhost:8080/add.php',formData,config)
      .then(res=>{
        console.log(res);
      })
      .catch(err=>{
         throw err 
      })
      this.myFunction()
    }
  
    showResult=()=>{
      const columns = [
        {
          title: 'No',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: 'Xinitial',
          dataIndex: 'xiinmain',
          key: 'xiinmain',
        },
        {
          title: 'XValue',
          dataIndex: 'xiw1inmain',
          key: 'xiw1inmain',
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
          <center><h5>This is Result of One-Point Iteration : {this.state.result}</h5></center><br/>
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
  
      onChangeSwitch = (checked) => {
        console.log(checked)
        this.setState({
          SwitchOpen:checked
        })
      }
    
      showInput = () =>{
        if(this.state.SwitchOpen){
          return <div>
          <center><Input placeholder="Input" style={{width:"13em" , marginLeft:"7%" , marginRight:"5%" , marginBottom:"0.5%"}} onChange={e=>this.setState({Eq:e.target.value})}/></center>
          <Button onClick={this.EquationBisection} style={{marginBottom:"0.5%", backgroundColor:"lightblue"}}>Add Equation</Button>
        </div>
        }
        else{
          return <center><Cascader
          options={this.state.options}
          expandTrigger="hover"
          displayRender={this.displayRender}
          onChange={this.onChange}
          style={{width:"13em" , marginLeft:"7%" , marginRight:"5%" , marginBottom:"0.5%"}}
          /></center>
        }
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
                   <center><h2>Onepoint</h2></center> 
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
export default Onepoint;