module MarkdownHelper
  def markdown(markdown_text)
    if markdown_text
      sanitize(Kramdown::Document.new(markdown_text,
                                      input: 'GFM',
                                      syntax_highlighter_opts: {guess_lang: true,
                                                                default_lang: 'ruby'})
                                 .to_html)
    else
      ''
    end
  end
end
