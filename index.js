require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

// OpenAI & TMDB 요청의 프록시를 위한 express 서버 구현
const app = express();
app.use(cors());
app.use(bodyParser.json());

// * 1. OpenAI에게 영화 추천 요청 응답을 위한 라우터
app.post('/recommendations', async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    max_tokens: 50,
    temperature: 0.5, // 결과의 다양성 수준 조절 (0 ~ 2)
    prompt: `suggest four moives most related to ${prompt}`,
  });

  res.send(completion.data.choices[0].text);
});

// 서버 설정 - 배포 시 포트 변동 대비
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
