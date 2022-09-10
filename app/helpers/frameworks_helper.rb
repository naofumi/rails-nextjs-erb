module FrameworksHelper
  def framework_image(source, alt)
    image_tag source, class: "bg-gray-100 rounded-lg", size: "264x264",
            style: "height: 264px; width: 264px; object-fit: cover",
            alt: alt
  end
end
