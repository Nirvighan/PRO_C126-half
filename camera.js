import React from 'react';
import { StyleSheet, Text, View,Button, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component{
    constructor(){
        super();
        this.state = {
            image:null
        }
    }

    getPermissionAsync = async() =>{
        
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if(status !== "granted"){
            alert("Sorry,we need camera roll permissions for this work");
        }
        

    }

    _pickImage = async() => {
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1

            })

            if(!result.cancelled){
                this.setState({
                    image:result.data
                })

                console.log(result.uri)
                this.uploadImage(result.uri)
            }

        }
        catch(E)
        {
            console.log(E)
        }
    }
    
    uploadImage = async(uri) => {
        const data = new FormData();
        let filename = uri.split("/")[uri.split("/").length-1]
        let type =  `image/${uri.split('.')[uri.split('.').length - 1]}`
        console.log("filename : "+filename)
        console.log("type : "+type)
        const filetoupload = {
            uri:uri,
            name:filename,
            type:type
        };
        data.append("digit",filetoupload);

        fetch("",{
            method:"POST",
            body:data,
            headers:{
                "content-type":"multipart/form-data",
                "Access-Control-Allow-Origin":"*"
            }
        })

        .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    componentDidMount(){
        this.getPermissionAsync();
    }

    render(){
        let {image} = this.state;
        return(
            <View style = {{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Button
                 title = "Pick an Image from camera roll"
                 onPress = {this._pickImage()}
                />
            </View>
        )
    }
}
