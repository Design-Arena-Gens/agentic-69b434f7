import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { content, accessToken } = await request.json()

    if (!content || !accessToken) {
      return NextResponse.json(
        { error: 'Content and access token are required' },
        { status: 400 }
      )
    }

    // Get user profile to get the person URN
    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    const userId = profileResponse.data.sub

    // Create the post
    const postData = {
      author: `urn:li:person:${userId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }

    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    )

    return NextResponse.json({
      success: true,
      postId: response.data.id,
    })
  } catch (error: any) {
    console.error('LinkedIn API Error:', error.response?.data || error.message)

    return NextResponse.json(
      {
        error: error.response?.data?.message || 'Failed to post to LinkedIn',
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    )
  }
}
