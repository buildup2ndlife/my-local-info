const fs = require('fs');
const path = require('path');

const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DATA_FILE_PATH = path.join(__dirname, '../public/data/local-info.json');

async function fetchPublicData() {
  try {
    // 1단계: 공공데이터포털 API에서 데이터 가져오기
    const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      console.log("데이터를 가져오지 못했습니다.");
      return;
    }

    // 필터링 규칙 (성남 -> 경기 -> 전체 순서)
    let filteredData = data.data.filter(item => 
      (item.서비스명 && item.서비스명.includes('성남')) || 
      (item.서비스목적요약 && item.서비스목적요약.includes('성남')) || 
      (item.지원대상 && item.지원대상.includes('성남')) || 
      (item.소관기관명 && item.소관기관명.includes('성남'))
    );

    if (filteredData.length === 0) {
      filteredData = data.data.filter(item => 
        (item.서비스명 && item.서비스명.includes('경기')) || 
        (item.서비스목적요약 && item.서비스목적요약.includes('경기')) || 
        (item.지원대상 && item.지원대상.includes('경기')) || 
        (item.소관기관명 && item.소관기관명.includes('경기'))
      );
    }

    if (filteredData.length === 0) {
      filteredData = data.data;
    }

    // 2단계: 기존 데이터와 비교
    const existingDataRaw = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const existingData = JSON.parse(existingDataRaw);
    const existingNames = new Set(existingData.map(item => item.name));

    const newData = filteredData.filter(item => !existingNames.has(item.서비스명));

    if (newData.length === 0) {
      console.log("새로운 데이터가 없습니다.");
      return;
    }

    // 3단계: Gemini AI로 새 항목 1개만 가공
    const targetItem = newData[0];
    const maxId = Math.max(...existingData.map(item => item.id), 0);

    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: ${maxId + 1}, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터: ${JSON.stringify(targetItem)}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiResult = await geminiResponse.json();
    let aiText = geminiResult.candidates[0].content.parts[0].text;
    
    // 마크다운 코드 블록 제거 및 순수 JSON 추출
    aiText = aiText.replace(/```json|```/g, '').trim();
    const processedItem = JSON.parse(aiText);

    // 4단계: 기존 데이터에 추가
    existingData.push(processedItem);
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(existingData, null, 2), 'utf8');

    console.log(`새로운 항목 추가 완료: ${processedItem.name}`);

  } catch (error) {
    console.error("오류 발생:", error);
  }
}

fetchPublicData();
