import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: 130,
        borderRadius: 4,
        backgroundColor: '#14274e',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40
      },
      buttonText:  {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      imgPreviewContainer:{
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        justifyContent: 'flex-end'
      },
      imgPreviewButtons:{
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      imgPreviewButton:{
        width: 130,
        height: 40,
        alignItems: 'center',
        borderRadius: 4
      },
      imgPreviewButtontext:{
        color: '#fff',
        fontSize: 20
      },
      cameraView:{
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row'
      },
      cameraTopButtons:{
        position: 'absolute',
        top: '5%',
      },
      takePictureButtonWrap:{
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        padding: 20,
        justifyContent: 'center'
      },
      takePictureButtonOutter:{
        backgroundColor: '#fff',
        width: 75,
        height: 75,
        borderRadius: 50,
        padding:5,
      },
      takePictureButtoninWrap:{
        flex:1,
        alignContent:"center",
        justifyContent:"center",
      },
      takePictureButton:{
        width: 63,
        height: 63,
        borderRadius: 50,
        backgroundColor: '#eaeaea',
        alignSelf: "center",
        justifySelf:"center"
      }
      
})