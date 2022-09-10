module ButtonsHelper
  def button_to_3(name = nil, options = nil, html_options = {}, &block)
    html_options[:class] = [html_options[:class], "inline-flex items-center px-4 py-2 border "\
                    "border-transparent text-sm font-medium rounded-md "\
                    "shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 "\
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 "\
                    "focus:ring-indigo-500"].join(' ')
    button_to name, options, html_options, &block
  end

  def link_to_3(name = nil, options = nil, html_options = {}, &block)
    html_options[:class] = [html_options[:class], "inline-flex items-center px-4 py-2 border "\
                    "border-transparent text-sm font-medium rounded-md "\
                    "shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 "\
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 "\
                    "focus:ring-indigo-500"].join(' ')
    link_to name, options, html_options, &block
  end

  def edit_button(resource)
    link_to "Edit #{resource.class.model_name.human}", [:edit, resource],
            class: "relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  end

  def new_button(resource_class)
    link_to "New #{resource_class.model_name.human}", resource_class,
            class: "relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  end
end
