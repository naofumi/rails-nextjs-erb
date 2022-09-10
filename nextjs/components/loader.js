import Image from "next/image"

export default function Loader (props) {
  const { className, ...rest } = props
  const classNameWithHidden = ['hidden', className].filter( f => f ).join(' ')

  return (
    <img src="/navigator.gif" className={classNameWithHidden}
                              {...rest}
                              id="loader"
                              alt="loader"
                              name="loader" />
  )
}

export function showLoader () {
  document.loader?.classList?.remove('hidden')
}

export function hideLoader () {
  document.loader?.classList?.add('hidden')
}

1
