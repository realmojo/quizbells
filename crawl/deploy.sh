#!/bin/bash

# Lambda 배포 스크립트
# 사용법: ./deploy.sh [method]
# method: serverless (기본값) 또는 zip

METHOD=${1:-serverless}

echo "🚀 Lambda 배포 시작 (방법: $METHOD)"

# 의존성 확인
if ! command -v npm &> /dev/null; then
    echo "❌ npm이 설치되어 있지 않습니다."
    exit 1
fi

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install --production

if [ "$METHOD" = "zip" ]; then
    echo "📦 ZIP 파일 생성 중..."
    zip -r function.zip . \
        -x "*.git*" \
        -x "node_modules/.cache/*" \
        -x "*.json.bak" \
        -x "README*" \
        -x "serverless.yml" \
        -x "package-lambda.json" \
        -x "deploy.sh" \
        -x ".gitignore" \
        -x "last-indexing.txt"
    
    echo "✅ function.zip 파일이 생성되었습니다."
    echo "📤 AWS Lambda 콘솔에서 이 파일을 업로드하세요."
    echo "   - 핸들러: lambda.handler"
    echo "   - 런타임: Node.js 20.x"
    echo "   - 타임아웃: 900초 (15분)"
    echo "   - 메모리: 512MB 이상"
    
elif [ "$METHOD" = "serverless" ]; then
    if ! command -v serverless &> /dev/null; then
        echo "❌ Serverless Framework가 설치되어 있지 않습니다."
        echo "   설치: npm install -g serverless"
        exit 1
    fi
    
    echo "🚀 Serverless Framework로 배포 중..."
    serverless deploy
    
    if [ $? -eq 0 ]; then
        echo "✅ 배포 완료!"
        echo "📊 로그 확인: serverless logs -f crawler --tail"
    else
        echo "❌ 배포 실패"
        exit 1
    fi
else
    echo "❌ 알 수 없는 방법: $METHOD"
    echo "   사용 가능한 방법: serverless, zip"
    exit 1
fi

