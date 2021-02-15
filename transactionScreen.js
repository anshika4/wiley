import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity,TextInput,Image} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions  from 'expo-permissions';
import firebase from 'firebase';
import db from '../config'

export default class TransactionScreen extends React.Component {
  constructor(){
    super();
    this.state={
     hasCameraPermissions:null,
     scanned:false,
     buttonState:'normal',
     scannedBookId:'',
     scannedStudentId:'',
     transactionMessage:'',
    }
  }


  initiateBookIssue=async()=>{
    db.collection('transactions').add({
      'studentId':this.state.scannedStudentId,
      'bookId':this.state.scannedBookId,
      'data':firebase.firestore.Timestamp.now().toDate(),
      'transactionType':'Issue'
    })
    //change book status
     db.collection("books").doc(this.state.scannedBookId).update({ 'bookAvailability' : false }) 
     //change number of issued books for student 
     db.collection("students").doc(this.state.scannedStudentId).update({
'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(1) }) 
this.setState({ 
  scannedStudentId : '', 
  scannedBookId: '' })
  }

  initiateBookReturn = async ()=>{ 
    //add a transaction 
    db.collection("transactions").add({ 
      'studentId' : this.state.scannedStudentId, 
      'bookId' : this.state.scannedBookId, 
      'date' : firebase.firestore.Timestamp.now().toDate(), 
      'transactionType' : "Return" 
    }) 
      //change book status 
      db.collection("books").doc(this.state.scannedBookId).update({ 'bookAvailability' : true }) 
      //change book status 
      db.collection("students").doc(this.state.scannedStudentId).update({ 
        'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(-1) }) 
        this.setState({ 
          scannedStudentId : '', 
          scannedBookId : '' 
        }) }

handleTransaction=async()=>{
var transactionMessage=null
db.collection('books').doc(this.state.scannedBookId).get()
.then((doc)=>{
  var book=doc.data();
  console.log(book)
  if(book.bookAvailability){
    this.initiateBookIssue();
    transactionMessage='Book Issued'
  }else{
    this.initiateBookReturn();
    transactionMessage='Book Returned'
  }
})
this.setState({
  transactionMessage:transactionMessage
})
}

  handleBarCodeScanned = async({type, data})=>{ 
    const {buttonState} = this.state 
    if(buttonState==="BookId"){ 
      this.setState({ 
        scanned: true, scannedBookId: data, 
        buttonState: 'normal' }); 
      } 
      else if(buttonState==="StudentId"){ 
        this.setState({ scanned: true, 
          scannedStudentId: data, 
          buttonState: 'normal' }); 
        } 
      }
  getCameraPermissions=async(id)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions:status==='granted',
      buttonState:id,
      scanned:false,
    })
  }
  render(){
    const hasCameraPermissions=this.state.hasCameraPermissions
    const scanned=this.state.scanned
    const buttonState=this.state.buttonState;
    if(buttonState!=='normal'&& hasCameraPermissions){
      return(
        <BarCodeScanner style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned?undefined:this.handleBarCodeScanned}
        />
      )
    }else if (buttonState==='normal'){
      return (
        <View 
        style={styles.container}>
          <View><Image style={{width:200,height:200}} source={require('../assets/booklogo.jpg')} />
          <Text style={{textAlign:'center',fontSize:30}}>Wily</Text></View>
          <View style={styles.inputView}>
            <TextInput style={styles.inputBox} 
            placeholder='Book Id'
            value={this.state.scannedBookId}/>
            <TouchableOpacity style={styles.scanButton} onPress={()=>{
              this.getCameraPermissions('BookId')
            }}><Text Style={styles.buttonText}>Scan</Text></TouchableOpacity>
          </View>
          <View style={styles.inputView}>
            <TextInput style={styles.inputBox} 
            placeholder='Student Id'
            value={this.state.scannedStudentId}/>
            <TouchableOpacity style={styles.scanButton} onPress={()=>{
              this.getCameraPermissions('StudentId')
            }}><Text Style={styles.buttonText}>Scan</Text></TouchableOpacity>
          </View>
          <Text>{this.state.transactionMessage}</Text>
          <TouchableOpacity style={styles.submitButton}
          onPress={async()=>{
            var transactionMessage=await this.handleTransaction();
          }}><Text style={styles.submitButtonText}>Submit</Text></TouchableOpacity>
        </View>
      );
    }
  
}
}

const styles = StyleSheet.create({ 
container: { flex: 1,
justifyContent: 'center', 
alignItems: 'center' 
}, 
displayText:{ fontSize: 15, 
textDecorationLine: 'underline' 
}, 
scanButton:{ 
backgroundColor: '#2196F3', 
padding: 10, margin: 10 
}, 
buttonText:{ 
fontSize: 20, 
} ,
inputView:{ 
  flexDirection: 'row', 
  margin: 20 
}, 
inputBox:{ 
width: 200, 
height: 40, 
borderWidth: 1.5, 
borderRightWidth: 0, 
fontSize: 20 },
submitButton:{ 
backgroundColor: '#FBC02D', 
width: 100, 
height:50 }, 
submitButtonText:{ 
padding: 10, 
textAlign: 'center', 
fontSize: 20, 
fontWeight:"bold", 
color: 'white' }
});