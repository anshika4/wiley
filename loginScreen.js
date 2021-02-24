import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity,TextInput, 
Alert,FlatList,KeyboardAvoidingView, KeyboardAvoidingViewBase,Image} from 'react-native';
import firebase from 'firebase';
import db from '../config'
export default class LoginScreen extends React.Component {
constructor(){
super();
this.state={
emailId:'',
password:'',
}
}    

login=async(emailId,password)=>{
    if(emailId && password){
    try{
        const response=await firebase.auth.signInWithEmailAndPassword(emailId,password)
        if(response){
        this.props.navigation.navigate('Transaction')    
        }     
        }    
    catch(error){
    switch (error.code) { 
    case 'auth/user-not-found': Alert.alert("user dosen't exists") 
    console.log("doesn't exist") 
    break 
    case 'auth/invalid-email': Alert.alert('incorrect email or password') 
    console.log('invaild')
    break 
    } //closingSwitch
    } 
    } 
    else{ Alert.alert('enter email and password'); 
    }
}


render(){
return(
<KeyboardAvoidingView style={{alignItems:'center',marginTop:20}}>
<View>
<Image style={{width:200,height:200}} source={require('../assets/booklogo.jpg')}/>
<Text style={{textAlign:'center',fontSize:30}}>Wily</Text>
</View>    
<View>
<TextInput style={styles.loginBox}
placeholder='abc@example.com'
keyboardType='email-address'
onChangeText={(text)=>{
this.setState({
    emailId:text
})    
}}/> 
<TextInput style={styles.loginBox}
placeholder='enter password'
secureTextEntry={true}
onChangeText={(text)=>{
this.setState({
password:text
})    
}}/>   
</View>
<View>
<TouchableOpacity style={{height:30,width:90,borderWidth:1,marginTop:20,paddingTop:5,borderRadius:7}} 
onPress={()=>{
this.login(this.state.emailId,this.state.password);
}}><Text style={{textAlign:'center'}}>Login</Text>
</TouchableOpacity>    
</View>
</KeyboardAvoidingView>
)
}
}

const styles = StyleSheet.create({ 
loginBox: { 
width: 300, 
height: 40, 
borderWidth: 1.5, 
fontSize: 20, 
margin:10, 
paddingLeft:10 
} })