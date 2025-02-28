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

function createWavHeader(dataSize: any, sampleRate: any) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF header
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, dataSize + 36, true); // File size
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // fmt sub-chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // Sub-chunk size
  view.setUint16(20, 1, true); // Audio format (PCM)
  view.setUint16(22, 1, true); // Channels (mono)
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // Bits per sample

  // data sub-chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true); // Data size

  return buffer;
}

async function wavToMp3(wavBuffer: AudioBuffer) {
  // 解码 WAV 数据
  const wav = new lamejs.WavFile(wavBuffer);
  const { sampleRate, channels, data } = wav.decode();

  // 初始化 MP3 编码器
  const mp3Encoder = new lamejs.Mp3Encoder(sampleRate, channels, 128);

  // 编码音频数据
  const mp3Data = [];
  const samplesPerFrame = 1152; // MP3 编码器的帧大小
  for (let i = 0; i < data.length; i += samplesPerFrame) {
    const chunk = data.slice(i, i + samplesPerFrame);
    const mp3Chunk = mp3Encoder.encodeBuffer(chunk);
    if (mp3Chunk.length > 0) {
      mp3Data.push(mp3Chunk);
    }
  }

  // 添加 MP3 文件头
  const mp3Header = mp3Encoder.flush();
  if (mp3Header.length > 0) {
    mp3Data.push(mp3Header);
  }

  // 合并为一个完整的 MP3 文件
  const mp3Buffer = new Uint8Array(mp3Data.reduce((a, b) => a + b.length, 0));
  let offset = 0;
  for (let chunk of mp3Data) {
    mp3Buffer.set(chunk, offset);
    offset += chunk.length;
  }

  return mp3Buffer;
}

export function convertToMP3(audioBuffer:AudioBuffer, audioContext: AudioContext) {
  const mp3Encoder = new lamejs.Mp3Encoder(1, audioContext.sampleRate, 128); // 单声道，采样率，比特率
  const samples = audioBuffer.getChannelData(0); // 获取第一个通道的数据
  const samples16Bit = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    samples16Bit[i] = samples[i] * 32767; // 将浮点数转换为 16 位整数
  }

  const mp3Data = [];
  const sampleBlockSize = 1152; // MP3 编码的块大小
  for (let i = 0; i < samples16Bit.length; i += sampleBlockSize) {
    const sampleBlock = samples16Bit.subarray(i, i + sampleBlockSize);
    const mp3Block = mp3Encoder.encodeBuffer(sampleBlock);
    if (mp3Block.length > 0) {
      mp3Data.push(mp3Block);
    }
  }

  const finalMp3Block = mp3Encoder.flush();
  if (finalMp3Block.length > 0) {
    mp3Data.push(finalMp3Block);
  }

  const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
  return mp3Blob;
}