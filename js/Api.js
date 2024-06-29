import storage from 'react-native-simple-store';
import axios from 'axios';
import metrics from './config/metrics'

export const API = {
  async get(URI,OBJETO) {

    OBJ = JSON.stringify(OBJETO);

    var axiosOptions = {
        method: 'POST',
        url: metrics.metrics.BASE_URL,
        data: 'Empresa='+metrics.metrics.EMPRESA+'&MODELO_BUILD='+metrics.metrics.MODELO_BUILD+'&TOKEN_TIPO='+metrics.metrics.TOKEN_TIPO+'&VERSION_BUILD='+metrics.metrics.VERSION_BUILD+'&Local='+URI+'&Objeto='+OBJ+'',
        json: true
    };

    return new Promise(function (resolve, reject) {
      axios(axiosOptions).then(function(response) {

        if (response.data.success===true) {
          resolve(response.data.data);
        } else {
          // console.log(response.data.msg);
          //alert(response.data.msg);
        }
      }).catch(function(error) {
        // console.log('CATCH API URL['+URI+']', error);
        // alert('Error ao realizar GET em '+URI+'!');
      });
    })

  },
  post() {

  }
}
