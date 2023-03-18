import toastr from 'toastr'

export function useToastr(){
    toastr.options.positionClass='toast-bottom-right'
    toastr.options.progressBar=true
    toastr.options.closeButton=true
    return toastr;
}