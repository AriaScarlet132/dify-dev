import lamejs from 'lamejs'
import MPEGMode from 'lamejs/src/js/MPEGMode'
import Lame from 'lamejs/src/js/Lame'
import BitStream from 'lamejs/src/js/BitStream'

if (globalThis) {
  (globalThis as any).MPEGMode = MPEGMode
  ;(globalThis as any).Lame = Lame
  ;(globalThis as any).BitStream = BitStream
}

export const convertToMp3 = (recorder: any) => {
  const wav = lamejs.WavHeader.readHeader(recorder.getWAV())
  const { channels, sampleRate } = wav
  const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128)
  const result = recorder.getChannelData()
  const buffer = []

  const leftData = result.left && new Int16Array(result.left.buffer, 0, result.left.byteLength / 2)
  const rightData = result.right && new Int16Array(result.right.buffer, 0, result.right.byteLength / 2)
  const remaining = leftData.length + (rightData ? rightData.length : 0)

  const maxSamples = 1152
  for (let i = 0; i < remaining; i += maxSamples) {
    const left = leftData.subarray(i, i + maxSamples)
    let right = null
    let mp3buf = null

    if (channels === 2) {
      right = rightData.subarray(i, i + maxSamples)
      mp3buf = mp3enc.encodeBuffer(left, right)
    }
    else {
      mp3buf = mp3enc.encodeBuffer(left)
    }

    if (mp3buf.length > 0)
      buffer.push(mp3buf)
  }

  const enc = mp3enc.flush()

  if (enc.length > 0)
    buffer.push(enc)

  return new Blob(buffer, { type: 'audio/mp3' })
}

export function convertWavToMP3(audioBuffer: AudioBuffer, audioContext: AudioContext) {
  const mp3Encoder = new lamejs.Mp3Encoder(1, audioContext.sampleRate, 128) // 单声道，采样率，比特率
  const samples = audioBuffer.getChannelData(0) // 获取第一个通道的数据
  const samples16Bit = new Int16Array(samples.length)
  for (let i = 0; i < samples.length; i++)
    samples16Bit[i] = samples[i] * 32767 // 将浮点数转换为 16 位整数

  const mp3Data = []
  const sampleBlockSize = 1152 // MP3 编码的块大小
  for (let i = 0; i < samples16Bit.length; i += sampleBlockSize) {
    const sampleBlock = samples16Bit.subarray(i, i + sampleBlockSize)
    const mp3Block = mp3Encoder.encodeBuffer(sampleBlock)
    if (mp3Block.length > 0)
      mp3Data.push(mp3Block)
  }

  const finalMp3Block = mp3Encoder.flush()
  if (finalMp3Block.length > 0)
    mp3Data.push(finalMp3Block)

  const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' })
  return mp3Blob
}

export function convertMP4ToMP3(audioBuffer: AudioBuffer, audioContext: AudioContext) {
  const sampleRate = audioBuffer.sampleRate;
  const mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128); // 单声道，128 kbps 比特率
  const mp3Data = [];
  const blockSize = 1152;

  for (let i = 0; i < audioBuffer.length; i += blockSize) {
    const chunkSize = Math.min(blockSize, audioBuffer.length - i);
    const samples = new Int16Array(chunkSize);
    for (let j = 0; j < chunkSize; j++) {
      samples[j] = Math.round(audioBuffer.getChannelData(0)[i + j] * 32767);
    }
    const mp3Chunk = mp3Encoder.encodeBuffer(samples);
    if (mp3Chunk.length > 0) {
      mp3Data.push(mp3Chunk);
    }
  }

  const mp3FinalChunk = mp3Encoder.flush();
  if (mp3FinalChunk.length > 0) {
    mp3Data.push(mp3FinalChunk);
  }

  // 使用 audio/mp3 作为 MIME 类型
  return new Blob(mp3Data, { type: "audio/mp3" });
}

export function isSafariOriOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isiOS = /iphone|ipad|ipod/.test(userAgent); // 判断是否是 iOS 设备
  const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent); // 判断是否是 Safari 浏览器

  return isiOS || isSafari; // 返回是否是 iOS 或 Safari 浏览器
}

export function downloadFile(blob: Blob, fileName: string) {
  // 创建一个 <a> 元素
  const downloadLink = document.createElement("a");

  // 创建一个对象 URL，指向 Blob 数据
  const url = URL.createObjectURL(blob);

  // 设置 <a> 元素的属性
  downloadLink.href = url; // 设置下载链接
  downloadLink.download = fileName; // 设置下载文件的文件名
  downloadLink.style.display = "none"; // 隐藏链接

  // 将 <a> 元素添加到文档中
  document.body.appendChild(downloadLink);

  // 触发点击事件，开始下载
  downloadLink.click();

  // 下载完成后移除 <a> 元素，并释放对象 URL
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}