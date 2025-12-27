'use client'

import { useState } from 'react'

export default function Home() {
  const [postContent, setPostContent] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [savedPosts, setSavedPosts] = useState<string[]>([])
  const [showInstructions, setShowInstructions] = useState(true)

  const handlePost = async () => {
    if (!postContent.trim()) {
      setMessage('Please enter some content for your post')
      setMessageType('error')
      return
    }

    if (!accessToken.trim()) {
      setMessage('Please enter your LinkedIn access token')
      setMessageType('error')
      return
    }

    setIsPosting(true)
    setMessage('')

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: postContent,
          accessToken: accessToken,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Post published successfully! 🎉')
        setMessageType('success')
        setSavedPosts([postContent, ...savedPosts])
        setPostContent('')
      } else {
        setMessage(data.error || 'Failed to post. Please check your access token.')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Error posting to LinkedIn. Please try again.')
      setMessageType('error')
    } finally {
      setIsPosting(false)
    }
  }

  const loadTemplate = (template: string) => {
    setPostContent(template)
  }

  const templates = [
    "🚀 Exciting day ahead! Here's what I'm working on:\n\n• [Project/Task 1]\n• [Project/Task 2]\n• [Project/Task 3]\n\nWhat are you focusing on today? #DailyUpdate #Productivity",
    "💡 Today I learned:\n\n[Share your learning or insight]\n\nAlways growing, always learning! #LearningJourney #ProfessionalGrowth",
    "✅ Daily wins:\n\n1. [Achievement 1]\n2. [Achievement 2]\n3. [Achievement 3]\n\nCelebrating progress! What did you accomplish today? #Wins #Success",
    "🎯 Monday Motivation:\n\n[Your motivational message or quote]\n\n#MondayMotivation #Inspiration",
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linkedin rounded-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LinkedIn Daily Poster</h1>
          <p className="text-gray-600">Share your daily updates with your professional network</p>
        </div>

        {showInstructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-blue-900">📋 How to Get Your Access Token</h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="underline font-medium">LinkedIn Developers</a></li>
              <li>Create an app or select an existing one</li>
              <li>Request access to the "Share on LinkedIn" and "Sign In with LinkedIn" products</li>
              <li>Add OAuth 2.0 redirect URLs in your app settings</li>
              <li>Use OAuth 2.0 to get your access token with <code className="bg-blue-100 px-1 py-0.5 rounded">w_member_social</code> scope</li>
              <li>Paste the token below</li>
            </ol>
            <p className="text-xs text-blue-700 mt-3">⚠️ Keep your access token secure and never share it publicly.</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Access Token
            </label>
            <input
              type="password"
              id="accessToken"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Enter your LinkedIn access token"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin focus:border-transparent outline-none"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-2">
              Your Daily Update
            </label>
            <textarea
              id="postContent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind today? Share your daily update, achievements, or insights..."
              rows={8}
              maxLength={3000}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin focus:border-transparent outline-none resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {postContent.length}/3000 characters
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => loadTemplate(template)}
                  className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                >
                  {template.split('\n')[0]}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handlePost}
            disabled={isPosting}
            className="w-full bg-linkedin hover:bg-linkedin-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? 'Posting...' : '📤 Post to LinkedIn'}
          </button>
        </div>

        {savedPosts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Recent Posts</h2>
            <div className="space-y-3">
              {savedPosts.map((post, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{post}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="text-center text-sm text-gray-500 mt-8">
          <p>Made with Next.js • Deploy anywhere, post everywhere</p>
        </footer>
      </div>
    </main>
  )
}
