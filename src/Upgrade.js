/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 17:38:31
 * @LastEditors: Liyb
 * @LastEditTime: 2021-09-17 23:33:46
 */
import React, { useState, MutableRefObject, useRef } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { Button, Input, Upload } from 'antd';
import '../src/views/style/layout.css';

const ipfsApi = require('ipfs-http-client');
const ipfs = ipfsApi.create({ host: 'localhost', port: '4001', protocal: 'http' });
console.log(ipfs);

export default function Main (props) {
  const [status, setStatus] = useState('');
  const [proposal, setProposal] = useState({});
  const { accountPair } = props;
  const [strHash, setStrHassh] = useState('');
  const [strContent, setStrContent] = useState('');
  const inputEl = useRef(null);

  const bufferToHex = buffer => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleFileChosen = file => {
    const fileReader = new FileReader();
    fileReader.onloadend = e => {
      const content = bufferToHex(fileReader.result);
      setProposal(`0x${content}`);
    };

    fileReader.readAsArrayBuffer(file);
  };
  const saveTextBlobOnIpfs = (blob) => {
    return new Promise(function (resolve, reject) {
      const descBuffer = Buffer.from(blob, 'utf-8');
      ipfs.add(descBuffer).then((response) => {
        console.log(response);
        resolve(response[0].hash);
      }).catch((err) => {
        console.error(err);
        reject(err);
      });
    });
  };
  const uploadIpfs = () => {
    const ipfsContent = inputEl.current.input.defaultValue;
    console.log('123', ipfsContent);
    console.log('123', inputEl);
    saveTextBlobOnIpfs(ipfsContent).then((hash) => {
      console.log(hash);
      setStrHassh(hash);
    });
  };
  const Utf8ArrayToStr = (array) => {
    console.log(array);
    let out, i, len, c;
    let char2, char3;
    out = '';
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
        // 110x xxxx 10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
          break;
        default:
          break;
      }
    }
    return out;
  };
  const onChange = (e) => {
    console.log(e);
  };
  return (
    <Grid.Column width={8}>
      <h1>上传文件信息</h1>
      <Form>
        <Form.Field style={{ width: 500, height: 100 }}>
        <a href="javascript:;" className="file gradient">选择文件
        <Input
            ref = {inputEl}
            id='file'
            style={{ width: '100px', height: '100px', opacity: 0 }}
            type='file'
            label='上传文件'
            value=""
            onChange = {onChange}
        />
        </a>
        <p></p>
        <Button type="primary"
          onClick= { uploadIpfs }>
              提交到ipfs
        </Button>
        <p>{strHash}</p>
        <Button type="primary"
        onClick = {() => {
          console.log('ipfs read data', ipfs);
          ipfs.cat(strHash).then((stream) => {
            console.log(stream);
            const strContent = Utf8ArrayToStr(stream);
            setStrContent(strContent);
            console.log(strContent);
          });
        }}>
          read data
        </Button>
        <p>{strContent}</p>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}
