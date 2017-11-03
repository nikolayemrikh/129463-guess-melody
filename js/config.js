export default {
  dataUrl: `https://es.dump.academy/guess-melody/questions`,
  maxMistakesCount: 4,
  maxGameRounds: 10,
  maxTime: 5 * 60,
  finishingTime: 30,
  maxTracksArtist: 3,
  maxTracksGenre: 4,
  fastAnswerTime: 30,
  keypair: {
    public: {
      "alg": `RSA-OAEP`,
      "e": `AQAB`,
      "ext": true,
      "key_ops": [`encrypt`],
      "kty": `RSA`,
      "n": `v4R9j_oqXbBQ_magXqxoRT5XiPwngvlqG02LJAix4pP6eRRM2B6PEV1oi8eU4uNSzY-RZNRo5FXsX_vmwD4oPdAR8W0VXIz4CSx5ADgQ5sPL9INA2p94RJKHA_U6Qr-p9dx_Rcd1P4IZE26c6gsVCIDg6uPb53tOnd_w4kaSFP8`
    },
    private: {
      "alg": `RSA-OAEP`,
      "d": `DSB7qr6u4LURGB7YpySSEQzw2wbNfoCx8SUjgFjIOIuEA4CMs9OEYuBQJiSL4_FI36YThSG5_syU4w9VBaA9CcEXlsHsWtsnZgYIbeaWvu0EHEe0EWypL-vN8X1iQ4LMzwdEvRNS5aIi1_aLU19ghjFB-PkFb4S6uCWoRuMta2E`,
      "dp": `eijWJACbcZyeGt-kIcpZuCO_Jk5XM_ePfZpZzIol8nyBJdutRyRjcJUW6PPU6ojl-smXVE6yoVjIchUspzvrxQ`,
      "dq": `SmTS1opRLFlXQ9q3ky9A5t0OBy3rQj3PJKp_Lgk8dsQ1N9z0RVrYk4JvGHJvo-aaIGVdKekuM2tuTKhrsiBBUQ`,
      "e": `AQAB`,
      "ext": true,
      "key_ops": [`decrypt`],
      "kty": `RSA`,
      "n": `v4R9j_oqXbBQ_magXqxoRT5XiPwngvlqG02LJAix4pP6eRRM2B6PEV1oi8eU4uNSzY-RZNRo5FXsX_vmwD4oPdAR8W0VXIz4CSx5ADgQ5sPL9INA2p94RJKHA_U6Qr-p9dx_Rcd1P4IZE26c6gsVCIDg6uPb53tOnd_w4kaSFP8`,
      "p": `83nII23w-dGgu9Q1A6W3bZ1OejYizZ5l15-knyojcbOjR04krPlHJpK0U3siEmNAoc8H2M71jWTluSJa3-HA8w`,
      "q": `yV5-6jBhWDUoh4cpovFeFQpUNT8VsrMVYllHcErimzkCysam6bPEGHorgfuaOatO81lW55RSsHbG8pReK9t-xQ`,
      "qi": `d6_cmS2c-_JCSidMyZRMQp8sxCyb2OJ37Wt7jWTWZ4aw9I--tyi0WKagvEOORhG1_bss-rtjtC6zOKQiJIlHXw`
    }
  }
};
