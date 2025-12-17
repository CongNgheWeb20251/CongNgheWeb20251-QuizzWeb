import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import EditNoteIcon from '@mui/icons-material/EditNote'

// const markdownValueExample = `
//   *\`Markdown Content Example:\`*

//   **Hello world | Trello MERN Stack Advanced**
//   [![](https://dailyaz.net/wp-content/uploads/2022/01/avatar-cap-cute-meo.jpg?v=4&s=80)](https://dailyaz.net/wp-content/uploads/2022/01/avatar-cap-cute-meo.jpg?v=4)
//   \`\`\`javascript
//   import React from "react"
//   import ReactDOM from "react-dom"
//   import MDEditor from '@uiw/react-md-editor'
//   \`\`\`
// `
/**
 * Vài ví dụ Markdown từ lib
 * https://codesandbox.io/embed/markdown-editor-for-react-izdd6?fontsize=14&hidenavigation=1&theme=dark
 */
function QuestionContentMdEditor({ questionContentProp, onUpdateQuestionContent }) {
  // Lấy giá trị 'dark', 'light' hoặc 'system' mode từ MUI để support phần Markdown bên dưới: data-color-mode={mode}
  // https://www.npmjs.com/package/@uiw/react-md-editor#support-dark-modenight-mode

  // State xử lý chế độ Edit và chế độ View
  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  // State xử lý giá trị markdown khi chỉnh sửa
  const [questionContent, setQuestionContent] = useState(questionContentProp)

  const updateQuestionContent = () => {
    setMarkdownEditMode(false)
    // console.log('questionContent: ', questionContent)
    onUpdateQuestionContent(questionContent || '')
  }

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode
        ? <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box >
            <MDEditor
              value={questionContent}
              onChange={setQuestionContent}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }} // https://www.npmjs.com/package/@uiw/react-md-editor#security
              height={400}
              preview="edit" // Có 3 giá trị để set tùy nhu cầu ['edit', 'live', 'preview']
              // hideToolbar={true}
            />
          </Box>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={updateQuestionContent}
            className="interceptor-loading"
            type="button"
            variant="contained"
            size="small"
            color="info">
            Save
          </Button>
        </Box>
        : <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setMarkdownEditMode(true)}
            type="button"
            variant="contained"
            color="info"
            size="small"
            startIcon={<EditNoteIcon />}>
            Edit
          </Button>
          <Box >
            <MDEditor.Markdown
              source={questionContent}
              style={{
                whiteSpace: 'pre-wrap',
                padding: questionContent ? '10px' : '0px',
                border:  questionContent ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px'
              }}
            />
          </Box>
        </Box>
      }
    </Box>
  )
}

export default QuestionContentMdEditor