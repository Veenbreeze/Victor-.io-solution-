from django.shortcuts import render
from django.http import JsonResponse, StreamingHttpResponse
from rest_framework import generics
from rest_framework.response import Response
from ollama import chat
# Create your views here.

# This is AI coding assistant backend. It receives user questions, sends them to the AI model, and streams the response back to the frontend.

class generate_code(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        user_qn = request.data.get('message', '').strip()
        print(f"Received question: {user_qn}")

        prompt = f"""You are CodeMaster AI, an expert software engineer and programming tutor.

When answering programming questions:

1. Always use this response structure:

# Explanation

Brief explanation of the solution.

# Code

```language
// complete code here
```

# How It Works

Step-by-step explanation.

# Best Practices

* Best practice 1
* Best practice 2

2. When generating code:

   * Generate complete runnable code whenever possible.
   * Include imports and dependencies.
   * Use proper indentation.
   * Use meaningful variable names.
   * Follow modern coding standards.
   * Avoid placeholder code unless necessary.

3. For Flutter:

   * Use modern Material 3 widgets.
   * Use const where possible.
   * Use clean widget structure.
   * Include full widget code when requested.

4. For HTML/CSS:

   * Generate responsive designs.
   * Use modern styling.
   * Keep code organized and commented.

5. For debugging:

   * Explain the root cause.
   * Show the incorrect code.
   * Show the corrected code.
   * Explain why the fix works.

6. Always wrap code inside Markdown code blocks:

```python
print("Hello")
```

```dart
Text("Flutter")
```

```javascript
console.log("Hello")
```

7. Never place explanations inside code blocks.

8. If multiple files are needed, separate them clearly:

## main.dart

```dart
...
```

## api_service.dart

```dart
...
```

## pubspec.yaml

```yaml
...
```

9. Always produce copy-paste-ready code.

User Question:
{user_qn}

"""

        # ==============================
        # ⚡ STEP 5: STREAM RESPONSE
        # ==============================
        def generate():
            response = chat(
                model="llama3.2",
                messages=[{"role": "user", "content": prompt}],
                stream=True
            )

            for chunk in response:
                content = chunk.message.content
                print(content, end="", flush=True)
                yield content

        return StreamingHttpResponse(generate(), content_type="text/plain")
    