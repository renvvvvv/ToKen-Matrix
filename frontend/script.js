const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// 页面加载时检查后端状态
document.addEventListener('DOMContentLoaded', function() {
    checkBackendStatus();
});

// 检查后端健康状态
function checkBackendStatus() {
    fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(data => {
        updateStatusDisplay(true, '后端服务正常运行');
    })
    .catch(error => {
        console.error('Error checking backend:', error);
        updateStatusDisplay(false, '无法连接后端服务（' + error.message + '）');
    });
}

// 更新状态显示
function updateStatusDisplay(isHealthy, message) {
    const statusDiv = document.getElementById('status');
    const messageDiv = document.getElementById('status-message');
    
    if (isHealthy) {
        statusDiv.textContent = '✅ 正常';
        statusDiv.classList.add('success');
        statusDiv.classList.remove('error');
    } else {
        statusDiv.textContent = '❌ 离线';
        statusDiv.classList.add('error');
        statusDiv.classList.remove('success');
    }
    
    messageDiv.textContent = message;
}

// 测试健康检查端点
function testHealth() {
    showTestResult('测试中...');
    
    fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        displayTestResult(JSON.stringify(data, null, 2), true);
    })
    .catch(error => {
        displayTestResult('错误: ' + error.message, false);
    });
}

// 测试搜索接口
function testSearch() {
    showTestResult('测试中...');
    
    const payload = {
        query: "测试查询"
    };
    
    fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        displayTestResult(JSON.stringify(data, null, 2), true);
    })
    .catch(error => {
        displayTestResult('错误: ' + error.message, false);
    });
}

// 测试控制台概览
function testOverview() {
    showTestResult('测试中...');
    
    fetch(`${API_BASE_URL}/console_overview`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        displayTestResult(JSON.stringify(data, null, 2), true);
    })
    .catch(error => {
        displayTestResult('错误: ' + error.message, false);
    });
}

// 显示测试结果
function showTestResult(message) {
    const resultDiv = document.getElementById('test-result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = message;
    resultDiv.classList.remove('success', 'error');
}

// 显示测试结果并标记为成功或失败
function displayTestResult(message, isSuccess) {
    const resultDiv = document.getElementById('test-result');
    resultDiv.textContent = message;
    resultDiv.style.display = 'block';
    
    if (isSuccess) {
        resultDiv.classList.add('success');
        resultDiv.classList.remove('error');
    } else {
        resultDiv.classList.add('error');
        resultDiv.classList.remove('success');
    }
}

// 定期检查后端状态（每30秒）
setInterval(checkBackendStatus, 30000);
