// ============================================
// RESUME KEYWORD MATCHER - core logic
// File: games/resume.js
// Version: 1.0.0
// Description: Keyword matching engine for resume analysis
// ============================================

// ---------- KNOWLEDGE BASE: keyword mapping for each role (rich & realistic) ----------
const ROLE_KEYWORDS_MAP = {
    "Frontend Developer": [
        "react", "vue", "angular", "html5", "css3", "javascript", "typescript", "redux", "context api",
        "tailwind css", "sass", "bootstrap", "webpack", "vite", "jest", "react testing library", "cypress",
        "responsive design", "cross-browser", "rest api", "graphql", "next.js", "accessibility", "git"
    ],
    "Backend Developer": [
        "node.js", "python", "java", "spring boot", "django", "flask", "go", "c#", ".net core", "php",
        "restful api", "graphql", "microservices", "sql", "postgresql", "mysql", "mongodb", "redis",
        "docker", "kubernetes", "aws", "azure", "ci/cd", "oauth", "jwt", "unit testing", "pytest", "junit"
    ],
    "Data Scientist": [
        "python", "r", "sql", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "matplotlib",
        "seaborn", "tableau", "power bi", "statistics", "hypothesis testing", "regression", "classification",
        "clustering", "nlp", "deep learning", "data wrangling", "feature engineering", "big data", "spark", "hadoop"
    ],
    "DevOps Engineer": [
        "linux", "bash", "python", "docker", "kubernetes", "jenkins", "gitlab ci", "github actions",
        "terraform", "ansible", "prometheus", "grafana", "aws", "azure", "gcp", "cloudformation",
        "monitoring", "logging", "elk stack", "nginx", "ci/cd", "infrastructure as code", "git"
    ],
    "Product Manager": [
        "agile", "scrum", "kanban", "product roadmap", "user stories", "backlog grooming", "sprint planning",
        "jira", "confluence", "trello", "user research", "user personas", "a/b testing", "analytics",
        "kpi", "nps", "mrr", "stakeholder management", "prioritization", "mvp", "product lifecycle"
    ],
    "UX/UI Designer": [
        "figma", "sketch", "adobe xd", "photoshop", "illustrator", "wireframing", "prototyping", "user flows",
        "usability testing", "user research", "interaction design", "visual design", "design system",
        "responsive design", "accessibility", "material design", "ios guidelines", "html/css basics", "invision"
    ],
    "Full Stack Developer": [
        "react", "angular", "vue", "node.js", "express", "django", "spring boot", "mongodb", "postgresql",
        "mysql", "rest", "graphql", "javascript", "typescript", "html", "css", "git", "docker", "aws",
        "heroku", "tailwind", "bootstrap", "redux", "jwt", "authentication", "ci/cd", "jest", "cypress"
    ],
    "Cybersecurity Analyst": [
        "network security", "firewall", "ids/ips", "siem", "splunk", "vulnerability assessment", "penetration testing",
        "risk management", "incident response", "compliance", "iso 27001", "nist", "gdpr", "encryption",
        "identity management", "iam", "endpoint protection", "malware analysis", "ethical hacking", "wireshark"
    ]
};

// ============================================
// DYNAMIC KEYWORD GENERATION FOR CUSTOM ROLES
// ============================================
function getDynamicKeywordsForRole(roleName) {
    const lowerRole = roleName.toLowerCase();
    
    // AI / Machine Learning roles
    if (lowerRole.includes("machine learning") || lowerRole.includes("ml engineer") || lowerRole.includes("ai engineer")) {
        return [
            "python", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", 
            "deep learning", "mlops", "docker", "kubernetes", "aws", "sql", 
            "data pipelines", "model deployment", "neural networks", "nlp"
        ];
    }
    
    // QA / Testing roles
    if (lowerRole.includes("qa") || lowerRole.includes("test") || lowerRole.includes("quality assurance")) {
        return [
            "manual testing", "automated testing", "selenium", "cypress", "junit", 
            "testng", "postman", "bug tracking", "jira", "regression testing", 
            "agile", "ci/cd", "performance testing", "load testing"
        ];
    }
    
    // Mobile development
    if (lowerRole.includes("mobile") || lowerRole.includes("ios") || lowerRole.includes("android")) {
        return [
            "swift", "kotlin", "react native", "flutter", "android sdk", "ios sdk", 
            "mvvm", "rest api", "firebase", "git", "ui testing", "app store deployment",
            "xcode", "android studio"
        ];
    }
    
    // Cloud roles
    if (lowerRole.includes("cloud") || lowerRole.includes("aws") || lowerRole.includes("azure") || lowerRole.includes("gcp")) {
        return [
            "aws", "azure", "gcp", "ec2", "s3", "lambda", "cloudformation", 
            "terraform", "kubernetes", "docker", "serverless", "vpc", "iam", 
            "cloud security", "cloud architecture"
        ];
    }
    
    // Data Engineering
    if (lowerRole.includes("data engineer") || lowerRole.includes("etl")) {
        return [
            "sql", "python", "scala", "spark", "hadoop", "airflow", "dbt", 
            "data warehousing", "etl pipelines", "bigquery", "redshift", "snowflake",
            "kafka", "data modeling"
        ];
    }
    
    // Default generic role keywords
    return [
        "communication", "team collaboration", "problem solving", "project management", 
        "agile", "critical thinking", "documentation", "leadership", "time management", 
        "data analysis", "reporting", "stakeholder management", "git", "rest apis", 
        "sql", "linux", "cloud computing", "ci/cd", "testing", "debugging"
    ];
}

// ============================================
// CORE MATCHING ENGINE
// ============================================

/**
 * Get keyword list for given role name (case-insensitive matching)
 * @param {string} roleName - The job role to get keywords for
 * @returns {Array} Array of keywords for the role
 */
function getKeywordsForRole(roleName) {
    // Find exact match from predefined roles
    for (let [key, keywords] of Object.entries(ROLE_KEYWORDS_MAP)) {
        if (key.toLowerCase() === roleName.toLowerCase()) {
            return [...keywords];
        }
    }
    
    // Check if role exists with original casing
    if (ROLE_KEYWORDS_MAP[roleName]) {
        return [...ROLE_KEYWORDS_MAP[roleName]];
    }
    
    // Dynamic generation for custom role
    return getDynamicKeywordsForRole(roleName);
}

/**
 * Normalize and match keyword against resume text
 * @param {string} resumeText - The resume text content
 * @param {string} keyword - The keyword to match
 * @returns {boolean} True if keyword is found in resume
 */
function normalizeKeywordMatch(resumeText, keyword) {
    if (!resumeText || !keyword) return false;
    
    const normalizedResume = resumeText.toLowerCase().replace(/[^\w\s\-\.#\+]/g, ' ');
    const keywordLower = keyword.toLowerCase();
    
    // Escape special regex characters
    const escapedKeyword = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Handle keywords with dots, hashes, or special chars (like c#, .net)
    const specialPattern = escapedKeyword.replace(/\\\./g, '\\.');
    
    // Create regex patterns for different matching strategies
    const patterns = [
        new RegExp(`\\b${specialPattern}\\b`, 'i'),  // Whole word boundary
        new RegExp(`${specialPattern}[\\s\\-_/]`, 'i'), // Followed by space or punctuation
        new RegExp(`[\\s\\-_/]${specialPattern}`, 'i'), // Preceded by space or punctuation
        new RegExp(`^${specialPattern}$`, 'i'), // Exact match
        new RegExp(`${specialPattern}s\\b`, 'i') // Plural form
    ];
    
    return patterns.some(pattern => pattern.test(normalizedResume));
}

/**
 * Perform keyword matching analysis
 * @param {string} resumeText - The resume text to analyze
 * @param {string} role - The job role to match against
 * @returns {Object} Analysis results with matched, missing, count, and percentage
 */
function analyzeResume(resumeText, role) {
    if (!resumeText || resumeText.trim() === "") {
        return {
            matched: [],
            missing: [],
            matchedCount: 0,
            totalCount: 0,
            percentage: 0,
            success: false,
            message: "Please provide resume text"
        };
    }
    
    const keywords = getKeywordsForRole(role);
    
    if (!keywords || keywords.length === 0) {
        return {
            matched: [],
            missing: [],
            matchedCount: 0,
            totalCount: 0,
            percentage: 0,
            success: false,
            message: `No keyword data available for role: ${role}`
        };
    }
    
    const matched = [];
    const missing = [];
    
    for (let kw of keywords) {
        if (normalizeKeywordMatch(resumeText, kw)) {
            matched.push(kw);
        } else {
            missing.push(kw);
        }
    }
    
    const matchedCount = matched.length;
    const totalCount = keywords.length;
    const percentage = totalCount === 0 ? 0 : Math.round((matchedCount / totalCount) * 100);
    
    return {
        matched: matched,
        missing: missing,
        matchedCount: matchedCount,
        totalCount: totalCount,
        percentage: percentage,
        success: true,
        message: "Analysis completed successfully"
    };
}

/**
 * Get improvement suggestions based on missing keywords
 * @param {Array} missingKeywords - Array of missing keywords
 * @param {string} role - The job role
 * @returns {Array} Categorized suggestions
 */
function getImprovementSuggestions(missingKeywords, role) {
    if (!missingKeywords || missingKeywords.length === 0) {
        return [{
            category: "Great job!",
            suggestions: ["Your resume is well-optimized for this role!"]
        }];
    }
    
    const suggestions = [];
    
    // Categorize missing keywords
    const technicalSkills = missingKeywords.filter(kw => 
        !kw.includes("communication") && !kw.includes("team") && 
        !kw.includes("management") && !kw.includes("leadership")
    );
    
    const softSkills = missingKeywords.filter(kw => 
        kw.includes("communication") || kw.includes("team") || 
        kw.includes("management") || kw.includes("leadership") ||
        kw.includes("collaboration") || kw.includes("problem solving")
    );
    
    const toolsAndTech = missingKeywords.filter(kw =>
        kw.includes("aws") || kw.includes("docker") || kw.includes("kubernetes") ||
        kw.includes("git") || kw.includes("jenkins") || kw.includes("jira") ||
        kw.includes("figma") || kw.includes("sketch")
    );
    
    if (technicalSkills.length > 0) {
        suggestions.push({
            category: "Technical Skills to Add",
            suggestions: technicalSkills.slice(0, 10)
        });
    }
    
    if (toolsAndTech.length > 0) {
        suggestions.push({
            category: "Tools & Technologies",
            suggestions: toolsAndTech.slice(0, 8)
        });
    }
    
    if (softSkills.length > 0) {
        suggestions.push({
            category: "Soft Skills to Highlight",
            suggestions: softSkills.slice(0, 6)
        });
    }
    
    // If still no categories, add general suggestions
    if (suggestions.length === 0 && missingKeywords.length > 0) {
        suggestions.push({
            category: "Recommended Keywords",
            suggestions: missingKeywords.slice(0, 15)
        });
    }
    
    return suggestions;
}

/**
 * Export analysis results as JSON for API integration
 * @param {Object} analysisResult - Result from analyzeResume function
 * @returns {string} JSON string of the analysis
 */
function exportAnalysisAsJSON(analysisResult) {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        matchedCount: analysisResult.matchedCount,
        totalKeywords: analysisResult.totalCount,
        matchPercentage: analysisResult.percentage,
        matchedKeywords: analysisResult.matched,
        missingKeywords: analysisResult.missing,
        recommendations: getImprovementSuggestions(analysisResult.missing, analysisResult.role || "current")
    }, null, 2);
}

// ============================================
// UI HELPER FUNCTIONS (for integration with HTML)
// ============================================

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

/**
 * Update UI with analysis results
 * @param {Object} results - Results from analyzeResume
 * @param {Object} elements - DOM elements to update
 */
function updateUIWithResults(results, elements) {
    if (!results.success) {
        if (elements.matchPercent) elements.matchPercent.innerText = "0%";
        if (elements.matchedCount) elements.matchedCount.innerText = "0";
        if (elements.totalKeywords) elements.totalKeywords.innerText = "0";
        if (elements.missingContainer) {
            elements.missingContainer.innerHTML = `<span style="color:#c2410c;">⚠️ ${escapeHtml(results.message)}</span>`;
        }
        if (elements.presentContainer) {
            elements.presentContainer.innerHTML = `<span style="color:#94a3b8;">Unable to analyze</span>`;
        }
        return;
    }
    
    // Update stats
    if (elements.matchPercent) elements.matchPercent.innerText = `${results.percentage}%`;
    if (elements.matchedCount) elements.matchedCount.innerText = results.matchedCount;
    if (elements.totalKeywords) elements.totalKeywords.innerText = results.totalCount;
    
    // Update missing keywords container
    if (elements.missingContainer) {
        if (results.missing.length === 0) {
            elements.missingContainer.innerHTML = `<span style="color:#2e7d32;">🎉 Amazing! No missing keywords — your resume is highly optimized!</span>`;
        } else {
            elements.missingContainer.innerHTML = results.missing.map(kw => 
                `<span class="missing-badge">${escapeHtml(kw)}</span>`
            ).join('');
        }
    }
    
    // Update present keywords container
    if (elements.presentContainer) {
        if (results.matched.length === 0) {
            elements.presentContainer.innerHTML = `<span style="color:#e07c3c;">⚠️ None of the key keywords found. Consider tailoring your resume.</span>`;
        } else {
            elements.presentContainer.innerHTML = results.matched.map(kw => 
                `<span class="present-badge">✓ ${escapeHtml(kw)}</span>`
            ).join('');
        }
    }
}

// ============================================
// EXPORTS (for different module systems)
// ============================================

// For browser global scope
if (typeof window !== 'undefined') {
    window.ResumeMatcher = {
        analyzeResume,
        getKeywordsForRole,
        getImprovementSuggestions,
        exportAnalysisAsJSON,
        updateUIWithResults,
        escapeHtml,
        ROLE_KEYWORDS_MAP
    };
}

// For Node.js/CommonJS (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeResume,
        getKeywordsForRole,
        getImprovementSuggestions,
        exportAnalysisAsJSON,
        updateUIWithResults,
        escapeHtml,
        ROLE_KEYWORDS_MAP
    };
}

// ============================================
// UNIT TESTS (self-contained for validation)
// ============================================

// Run tests if in Node.js environment or if TEST_MODE is enabled
const isTestMode = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') ||
                   (typeof window !== 'undefined' && window.location && window.location.search.includes('test=true'));

if (isTestMode) {
    console.log("🧪 Running Resume Matcher Tests...");
    
    const testResults = [];
    
    // Test 1: Basic matching
    const test1 = analyzeResume("React and Node.js developer", "Frontend Developer");
    testResults.push({
        name: "Basic matching",
        passed: test1.matched.includes("react") && test1.matchedCount > 0,
        result: test1
    });
    
    // Test 2: Empty resume
    const test2 = analyzeResume("", "Frontend Developer");
    testResults.push({
        name: "Empty resume handling",
        passed: !test2.success && test2.percentage === 0,
        result: test2
    });
    
    // Test 3: Case insensitivity
    const test3 = analyzeResume("REACT and TYPESCRIPT expert", "Frontend Developer");
    testResults.push({
        name: "Case insensitivity",
        passed: test3.matched.includes("react") && test3.matched.includes("typescript"),
        result: test3
    });
    
    // Test 4: Custom role generation
    const customKeywords = getKeywordsForRole("ML Engineer");
    testResults.push({
        name: "Custom role keyword generation",
        passed: customKeywords.includes("tensorflow") && customKeywords.includes("python"),
        result: { keywords: customKeywords }
    });
    
    // Test 5: Missing keywords identification
    const test5 = analyzeResume("Only HTML and CSS", "Frontend Developer");
    testResults.push({
        name: "Missing keywords detection",
        passed: test5.missing.includes("react") || test5.missing.includes("javascript"),
        result: test5
    });
    
    console.table(testResults);
    console.log(`✅ ${testResults.filter(t => t.passed).length}/${testResults.length} tests passed`);
}

// End of resume.js