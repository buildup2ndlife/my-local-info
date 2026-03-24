const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DATA_FILE_PATH = path.join(__dirname, '../public/data/local-info.json');
const POSTS_DIR_PATH = path.join(__dirname, '../src/content/posts');

async function generateBlogPost() {
  try {
    // 1단계: 최신 데이터 확인
    const dataRaw = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const infoList = JSON.parse(dataRaw);
    if (infoList.length === 0) {
      console.log("데이터가 없습니다.");
      return;
    }

    const latestItem = infoList[infoList.length - 1]; // 마지막 항목
    const existingFiles = fs.readdirSync(POSTS_DIR_PATH).filter(f => f.endsWith('.md'));

    // 이미 같은 이름(name)으로 글이 있는지 확인
    let alreadyExists = false;
    for (const file of existingFiles) {
      const content = fs.readFileSync(path.join(POSTS_DIR_PATH, file), 'utf8');
      // frontmatter의 title 부분 위주로 체크
      if (content.includes(`title: ${latestItem.name}`) || content.includes(`title: "${latestItem.name}"`)) {
        alreadyExists = true;
        break;
      }
    }

    if (alreadyExists) {
      console.log("이미 작성된 글입니다.");
      return;
    }

    // 2단계: Gemini AI로 블로그 글 생성
    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: (오늘 날짜 YYYY-MM-DD)
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiResult = await geminiResponse.json();
    let aiResponseText = geminiResult.candidates[0].content.parts[0].text;

    // 마크다운 코드 블록 제거
    aiResponseText = aiResponseText.replace(/```markdown|```/g, '').trim();

    // FILENAME 추출
    const filenameMatch = aiResponseText.match(/FILENAME:\s*(.+)$/m);
    let filename = "";
    let finalContent = aiResponseText;

    if (filenameMatch) {
      filename = filenameMatch[1].trim();
      if (!filename.endsWith('.md')) filename += '.md';
      // 본문에서 FILENAME 줄 제거
      finalContent = aiResponseText.replace(filenameMatch[0], '').trim();
    } else {
      // 파일명이 없을 경우를 위한 기본값 생성
      const today = new Date().toISOString().split('T')[0];
      filename = `${today}-news.md`;
    }

    // 3단계: 파일 저장
    const finalFilePath = path.join(POSTS_DIR_PATH, filename);
    fs.writeFileSync(finalFilePath, finalContent, 'utf8');

    console.log(`블로그 글 생성 완료: ${filename}`);

  } catch (error) {
    console.error("오류 발생:", error);
  }
}

generateBlogPost();
